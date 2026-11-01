import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../config';

export class SocketService {
  private static io: SocketIOServer | null = null;

  public static init(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps or server-to-server)
          if (!origin) return callback(null, true);
          if (config.allowedOrigins.includes(origin) || !config.isProduction) {
            return callback(null, true);
          }
          return callback(new Error('Origin not allowed by WebSocket CORS'));
        },
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.on('connection', (socket: Socket) => {
      // Join event room for live coordination
      socket.on('join_event_room', (eventId: string) => {
        socket.join(`event:${eventId}`);
      });

      socket.on('leave_event_room', (eventId: string) => {
        socket.leave(`event:${eventId}`);
      });

      // Organizer announcements
      socket.on('send_announcement', (data: { eventId: string; title: string; content: string; senderName: string }) => {
        this.io?.to(`event:${data.eventId}`).emit('new_announcement', {
          ...data,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('disconnect', () => {
        // Handled silently
      });
    });

    console.log('[SocketService] Real-time Socket.IO coordination server initialized.');
  }

  public static broadcastAttendanceCheckIn(eventId: string, volunteerData: any) {
    this.io?.to(`event:${eventId}`).emit('volunteer_checked_in', volunteerData);
  }

  public static broadcastTaskUpdate(eventId: string, taskData: any) {
    this.io?.to(`event:${eventId}`).emit('task_status_changed', taskData);
  }
}
