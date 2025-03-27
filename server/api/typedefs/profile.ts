import { gql } from 'apollo-server-express';

export const profileTypeDefs = gql`
  input UpdateProfileInput {
    name: String!
    contactNumber: String!
    emergencyName: String!
    emergencyContact: String!
  }
  
  extend type Query {
    getUserProfile: User!
  }
  
  extend type Mutation {
    updateUserProfile(input: UpdateProfileInput!): User!
    updateTouchId(currentTouchId: String!, newTouchId: String!): User!
  }
`;
