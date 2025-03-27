// services/authService.ts
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const TOKEN_EXPIRY = '7d'; // Token expires in 7 days

export const authService = {
  generateToken: (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  },
  
  verifyToken: (token: string): { userId: string } | null => {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      logger.error('Token verification failed', error);
      return null;
    }
  },
  
  getUserByPublicKey: async (publicKey: string) => {
    try {
      return await prisma.user.findUnique({
        where: { publicKey }
      });
    } catch (error) {
      logger.error('Failed to get user by public key', error);
      return null;
    }
  }
};
