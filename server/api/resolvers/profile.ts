import { PrismaClient } from '@prisma/client';
import { AuthenticationError } from 'apollo-server-express';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

export const profileResolvers = {
  Query: {
    getUserProfile: async (_, __, { userId }) => {
      if (!userId) {
        throw new AuthenticationError('You must be logged in');
      }
      
      return prisma.user.findUnique({
        where: { id: userId }
      });
    }
  },
  
  Mutation: {
    updateUserProfile: async (_, { input }, { userId }) => {
      if (!userId) {
        throw new AuthenticationError('You must be logged in');
      }
      
      const { name, contactNumber, emergencyName, emergencyContact } = input;
      
      return prisma.user.update({
        where: { id: userId },
        data: {
          name,
          contactNumber,
          emergencyName,
          emergencyContact
        }
      });
    },
    
    updateTouchId: async (_, { currentTouchId, newTouchId }, { userId }) => {
      if (!userId) {
        throw new AuthenticationError('You must be logged in');
      }
      
      // Hash the current touchId for verification
      const currentTouchIdHash = createHash('sha256').update(currentTouchId).digest('hex');
      
      // Find user and verify current touchId
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user || user.publicKey !== currentTouchIdHash) {
        throw new AuthenticationError('Current Touch ID is invalid');
      }
      
      // Hash the new touchId
      const newTouchIdHash = createHash('sha256').update(newTouchId).digest('hex');
      
      // Update user with new touchId
      return prisma.user.update({
        where: { id: userId },
        data: { publicKey: newTouchIdHash }
      });
    }
  }
};
