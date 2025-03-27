import { gql } from 'apollo-server-express';
import { authTypeDefs } from './auth';
import { profileTypeDefs } from './profile';

// Base schema with empty types that can be extended
const baseTypeDefs = gql`
  type Query {
    _: Boolean
    healthCheck: String!
  }
  
  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [
  baseTypeDefs,
  authTypeDefs,
  profileTypeDefs,
];
