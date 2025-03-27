import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {logger} from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret',
      ) as {userId: string};
      req.userId = decoded.userId;
    } catch (error) {
      logger.error('Invalid token', error);
      // We don't throw an error here, just don't set the userId
      // GraphQL resolvers will handle authentication checks
    }
  }

  next();
};
