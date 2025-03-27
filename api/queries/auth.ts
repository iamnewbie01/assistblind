import {gql} from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      token
      user {
        id
        name
        contactNumber
        emergencyName
        emergencyContact
      }
    }
  }
`;

export const LOGIN_WITH_TOUCH_ID = gql`
  mutation LoginWithTouchId(
    $signature: String!
    $payload: String!
    $publicKey: String!
  ) {
    loginWithTouchId(
      signature: $signature
      payload: $payload
      publicKey: $publicKey
    ) {
      token
      user {
        id
        name
        contactNumber
        emergencyName
        emergencyContact
      }
    }
  }
`;

// Type definitions for TypeScript
export interface RegisterUserInput {
  name: string;
  contactNumber: string;
  emergencyName: string;
  emergencyContact: string;
  touchId: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    contactNumber: string;
    emergencyName: string;
    emergencyContact: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RegisterUserData {
  registerUser: AuthResponse;
}

export interface LoginWithTouchIdData {
  loginWithTouchId: AuthResponse;
}
