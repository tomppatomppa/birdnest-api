import { gql } from 'apollo-server'
import Bird from '../../models/Bird.js'

export const typeDefs = gql`
  type Bird {
    name: String
  }
  extend type Query {
    getBirds: [Bird!]
  }
`

export const resolvers = {
  Query: {
    getBirds: async () => {
      const allBirds = await Bird.find({})
      return allBirds
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
