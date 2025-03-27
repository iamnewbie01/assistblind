import { authResolvers } from './auth';
import { profileResolvers } from './profile';

// Merge all resolvers
export const resolvers = {
  Query: {
    healthCheck: () => "GraphQL is working perfectly",
    ...profileResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...profileResolvers.Mutation,
  }
};
