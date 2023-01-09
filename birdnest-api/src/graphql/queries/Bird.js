import { ApolloError, gql } from 'apollo-server'
import Bird from '../../models/Bird.js'
import Nest from '../../models/Nest.js'

export const typeDefs = gql`
  type Bird {
    name: String
    protectedNests: [Nest]
  }
  extend type Query {
    getBirds: [Bird!]
    getBird(name: String!): Bird!
  }
`

export const resolvers = {
  Query: {
    getBirds: async () => {
      const allBirds = await Bird.find({})
      return allBirds
    },
    getBird: async (_, { name }) => {
      const birdFound = await Bird.findOne({ name: name }).populate(
        'protectedNests'
      )
      if (!birdFound) {
        throw new ApolloError(
          `No bird with the name ${name} exists in the database`
        )
      }
      return birdFound
    },
  },
}

export default {
  typeDefs,
  resolvers,
}