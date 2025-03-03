import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from '../../../domain/errors/AppError';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const payload = jwt.verify(token, secretKey) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (req.user.role !== 'admin') {
    return next(new ForbiddenError('Admin privileges required'));
  }

  next();
}