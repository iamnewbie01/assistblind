import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../graphql';

export const GET_USER_PROFILE = gql`
  ${USER_FRAGMENT}
  query GetUserProfile {
    getUserProfile {
      ...UserFields
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  ${USER_FRAGMENT}
  mutation UpdateUserProfile($input: UpdateProfileInput!) {
    updateUserProfile(input: $input) {
      ...UserFields
    }
  }
`;

export const UPDATE_TOUCH_ID = gql`
  ${USER_FRAGMENT}
  mutation UpdateTouchId($currentTouchId: String!, $newTouchId: String!) {
    updateTouchId(currentTouchId: $currentTouchId, newTouchId: $newTouchId) {
      ...UserFields
    }
  }
`;

// Type definitions for TypeScript
export interface UserProfile {
  id: string;
  name: string;
  contactNumber: string;
  emergencyName: string;
  emergencyContact: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  name: string;
  contactNumber: string;
  emergencyName: string;
  emergencyContact: string;
}

export interface GetUserProfileData {
  getUserProfile: UserProfile;
}

export interface UpdateUserProfileData {
  updateUserProfile: UserProfile;
}

export interface UpdateTouchIdData {
  updateTouchId: UserProfile;
}
