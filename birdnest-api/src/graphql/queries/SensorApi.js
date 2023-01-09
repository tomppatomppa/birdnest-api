import { AuthenticationError, gql } from 'apollo-server'
import dotenv from 'dotenv'
dotenv.config()
const API_SECRET = process.env.API_SECRET

export const typeDefs = gql`
  extend type Query {
    getSensorData(apiKey: String!): String
  }
`
export const resolvers = {
  Query: {
    getSensorData: async (_, { apiKey }) => {
      if (apiKey !== API_SECRET) {
        throw new AuthenticationError('Invalid Api key')
      }

      return 'Access to call api granted'
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
