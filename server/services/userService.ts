import {PrismaClient} from '@prisma/client';
import {createHash} from 'crypto';
import {logger} from '../utils/logger';

const prisma = new PrismaClient();

interface User {
  id: string;
  name: string;
  contactNumber: string;
  emergencyName: string;
  emergencyContact: string;
  touchIdHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  createUser: async (
    name: string,
    contactNumber: string,
    emergencyName: string,
    emergencyContact: string,
    touchId: string,
  ): Promise<User> => {
    try {
      const touchIdHash = createHash('sha256').update(touchId).digest('hex');

      return await prisma.user.create({
        data: {
          name,
          contactNumber,
          emergencyName,
          emergencyContact,
          touchIdHash,
        },
      });
    } catch (error) {
      logger.error('User creation failed', error);
      throw new Error('Failed to create user');
    }
  },

  getUserById: async (userId: string): Promise<User | null> => {
    try {
      return await prisma.user.findUnique({
        where: {id: userId},
      });
    } catch (error) {
      logger.error('Get user by ID failed', error);
      return null;
    }
  },

  updateUser: async (
    userId: string,
    data: {
      name?: string;
      contactNumber?: string;
      emergencyName?: string;
      emergencyContact?: string;
    },
  ): Promise<User | null> => {
    try {
      return await prisma.user.update({
        where: {id: userId},
        data,
      });
    } catch (error) {
      logger.error('User update failed', error);
      return null;
    }
  },

  updateTouchId: async (
    userId: string,
    newTouchId: string,
  ): Promise<User | null> => {
    try {
      const touchIdHash = createHash('sha256').update(newTouchId).digest('hex');

      return await prisma.user.update({
        where: {id: userId},
        data: {touchIdHash},
      });
    } catch (error) {
      logger.error('Touch ID update failed', error);
      return null;
    }
  },
};
