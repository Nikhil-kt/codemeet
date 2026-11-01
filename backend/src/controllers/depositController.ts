import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class DepositController {
  public static async checkoutDeposit(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.body;
      const org = db.organizations.find(o => o.profile_id === req.user?.profileId);

      if (!org) {
        res.status(403).json({ success: false, message: 'Only organizations can manage security deposits.' });
        return;
      }

      const event = db.events.find(e => e.id === eventId);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found.' });
        return;
      }

      if (org.deposit_exempt) {
        res.status(400).json({ success: false, message: 'Organization is exempt from security deposits.' });
        return;
      }

      let deposit = db.deposits.find(d => d.event_id === eventId);
      if (!deposit) {
        deposit = {
          id: uuidv4(),
          organization_id: org.id,
          event_id: eventId,
          amount: event.deposit_required_amount || 5000.0,
          currency: 'INR',
          status: 'PENDING',
          refund_eligible: false,
          terms_accepted: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        db.deposits.push(deposit);
      }

      // Simulate payment checkout session
      const simulatedCheckoutSessionId = `cs_test_${uuidv4().replace(/-/g, '')}`;

      res.json({
        success: true,
        message: 'Deposit checkout session initialized.',
        deposit_id: deposit.id,
        amount: deposit.amount,
        currency: deposit.currency,
        checkout_url: `https://checkout.impactlink.org/pay/${simulatedCheckoutSessionId}`,
        terms: 'Refundable security deposit held in trust. Fully refundable upon clean event completion and verified attendance without severe misconduct disputes.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Checkout initialization failed', error: err.message });
    }
  }

  public static async confirmPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { depositId } = req.params;
      const deposit = db.deposits.find(d => d.id === depositId);

      if (!deposit) {
        res.status(404).json({ success: false, message: 'Deposit not found.' });
        return;
      }

      deposit.status = 'PAID';
      deposit.paid_at = new Date().toISOString();
      deposit.payment_provider_reference = `txn_${uuidv4().slice(0, 12)}`;

      // Update event deposit status
      const event = db.events.find(e => e.id === deposit.event_id);
      if (event) {
        event.deposit_status = 'PAID';
      }

      // Record in financial audit log
      db.audit_logs.push({
        id: uuidv4(),
        user_id: req.user?.profileId || null,
        action: 'DEPOSIT_PAID',
        resource: `deposit:${deposit.id}`,
        ip_address: req.ip || null,
        user_agent: req.headers['user-agent'] || null,
        created_at: new Date().toISOString()
      });

      res.json({
        success: true,
        message: 'Deposit payment confirmed. Event is now eligible for approval.',
        deposit
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Payment confirmation failed', error: err.message });
    }
  }

  public static async getDepositStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const org = db.organizations.find(o => o.profile_id === req.user?.profileId);
    if (!org) {
      res.status(404).json({ success: false, message: 'Organization not found.' });
      return;
    }

    const deposits = db.deposits.filter(d => d.organization_id === org.id);
    res.json({ success: true, is_exempt: org.deposit_exempt, deposits });
  }

  public static async requestRefund(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deposit = db.deposits.find(d => d.id === id);

      if (!deposit) {
        res.status(404).json({ success: false, message: 'Deposit not found.' });
        return;
      }

      const event = db.events.find(e => e.id === deposit.event_id);
      if (event && event.status !== 'COMPLETED') {
        res.status(400).json({
          success: false,
          message: `Refund cannot be processed until the event is marked COMPLETED (Current status: ${event.status}).`
        });
        return;
      }

      deposit.status = 'REFUNDED';
      deposit.refunded_at = new Date().toISOString();

      res.json({
        success: true,
        message: `Refund of ${deposit.currency} ${deposit.amount} processed successfully back to the original source.`,
        deposit
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Refund failed', error: err.message });
    }
  }
}

