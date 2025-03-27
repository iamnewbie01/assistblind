// resolvers/auth.ts
import {PrismaClient} from '@prisma/client';
import {AuthenticationError} from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import {authService} from '../../services/authService';
import {verifyBiometricSignature} from '../../utils/biometricUtils';

const prisma = new PrismaClient();

export const authResolvers = {
  Mutation: {
    registerUser: async (_, {input}) => {
      const {name, contactNumber, emergencyName, emergencyContact, touchId} =
        input;

      // In this case, touchId is actually the publicKey from biometric registration
      const publicKey = touchId;

      // Check if user with this publicKey already exists
      const existingUser = await prisma.user.findUnique({
        where: {publicKey},
      });

      if (existingUser) {
        throw new Error('User with this fingerprint already exists');
      }

      // Create new user
      const user = await prisma.user.create({
        data: {
          name,
          contactNumber,
          emergencyName,
          emergencyContact,
          publicKey,
        },
      });

      // Generate token
      const token = authService.generateToken(user.id);

      return {
        token,
        user,
      };
    },

    loginWithTouchId: async (_, {signature, payload, publicKey}) => {
      // Find user with this publicKey
      console.log('loginWithTouchId called');
      const user = await prisma.user.findUnique({
        where: {publicKey},
      });

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      console.log('Payload:', payload);
      console.log('Signature (first 20 chars):', signature.substring(0, 20));
      console.log('Public Key (first 20 chars):', publicKey.substring(0, 20));

      // Verify the biometric signature
      const isValid = verifyBiometricSignature(signature, payload, publicKey);

      if (!isValid) {
        throw new AuthenticationError('Invalid biometric signature');
      }

      // Generate token
      const token = authService.generateToken(user.id);

      return {
        token,
        user,
      };
    },
  },
};
