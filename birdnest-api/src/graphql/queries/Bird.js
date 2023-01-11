import { gql } from 'apollo-server'
import Bird from '../../models/Bird.js'
import Nest from '../../models/Nest.js'

export const typeDefs = gql`
  type Bird {
    name: String
    protectedNests: [Nest]
  }
  extend type Query {
    getBirds: [Bird!]
  }
`

export const resolvers = {
  Query: {
    getBirds: async () => {
      const allBirds = await Bird.find({}).populate('protectedNests', 'url')
      return allBirds
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
