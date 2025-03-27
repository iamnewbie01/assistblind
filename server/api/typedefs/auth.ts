import {gql} from 'apollo-server-express';

export const authTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    contactNumber: String!
    emergencyName: String!
    emergencyContact: String!
    publicKey: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterUserInput {
    name: String!
    contactNumber: String!
    emergencyName: String!
    emergencyContact: String!
    touchId: String!
  }

  extend type Mutation {
    registerUser(input: RegisterUserInput!): AuthPayload!
    loginWithTouchId(
      signature: String!
      payload: String!
      publicKey: String!
    ): AuthPayload!
  }
`;
