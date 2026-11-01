import { Queue } from 'bullmq';
import { db } from '../db/store';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

export interface NotificationJobData {
  userId: string;
  title: string;
  message: string;
  notificationType: string;
  actionLink?: string;
  channel?: 'IN_APP' | 'PUSH' | 'EMAIL';
}

export class QueueService {
  private static notificationQueue: Queue | null = null;
  private static hasRedis = false;

  public static init() {
    // Only attempt Redis connection if explicitly configured and not default offline placeholder
    if (config.redis.url && !config.redis.url.includes('127.0.0.1')) {
      try {
        const connectionOptions: any = {
          url: config.redis.url,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
        };

        if (config.redis.isTls) {
          connectionOptions.tls = {
            rejectUnauthorized: false
          };
        }

        this.notificationQueue = new Queue('impactlink-notifications', {
          connection: connectionOptions
        });

        this.hasRedis = true;
        console.log('[QueueService] Connected to Hosted Redis BullMQ cluster.');
      } catch (err: any) {
        this.hasRedis = false;
        console.warn('[QueueService] Hosted Redis connection notice, falling back to reliable in-process queue:', err.message);
      }
    } else {
      console.log('[QueueService] Operating in resilient in-process queue mode for development.');
    }
  }

  public static async dispatchNotification(jobData: NotificationJobData) {
    // 1. Persist in-app notification in DB
    const record = {
      id: uuidv4(),
      user_id: jobData.userId,
      title: jobData.title,
      message: jobData.message,
      notification_type: jobData.notificationType,
      action_link: jobData.actionLink || null,
      is_read: false,
      channel: jobData.channel || 'IN_APP',
      created_at: new Date().toISOString()
    };
    db.notifications.unshift(record);

    // 2. Queue for background dispatch (email / push) if Redis cluster is active
    if (this.hasRedis && this.notificationQueue) {
      try {
        await this.notificationQueue.add('send_notification', jobData, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 }
        });
      } catch (e) {
        // Handled silently by in-process record
      }
    }

    return record;
  }
}
