import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { UserRole } from '../types';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized request.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' lacks permission for this endpoint. Required: [${allowedRoles.join(', ')}]`
      });
      return;
    }

    next();
  };
};

