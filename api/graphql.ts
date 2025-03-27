import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fragment for user fields to reuse across queries
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    contactNumber
    emergencyName
    emergencyContact
    createdAt
    updatedAt
  }
`;

// Export common fragments and utility functions
export const formatError = (error: any): string => {
  if (!error) return '';
  
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors.map((e: any) => e.message).join(', ');
  }
  
  if (error.networkError) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unknown error occurred';
};

// Helper to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  return !!(await AsyncStorage.getItem('token'));
};

// Helper to log out user
export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
  // Force a reload of the page to reset Apollo cache
  window.location.href = '/login';
};
