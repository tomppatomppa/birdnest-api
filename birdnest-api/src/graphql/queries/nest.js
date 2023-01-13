import { gql } from 'apollo-server'
import Nest from '../../models/Nest.js'

export const typeDefs = gql`
  extend type Query {
    getNest(id: String): Nest!
  }
`
const getMinutesBeforeNow = (min) => {
  let afterDate = new Date()

  let modified = afterDate.setMinutes(afterDate.getMinutes() - min)

  return new Date(modified)
}

export const resolvers = {
  Query: {
    getNest: async (_, { id }) => {
      //Only retrieve pilots who have been seen in the last 10 minutes
      let pilotsAfter = getMinutesBeforeNow(10)

      const result = await Nest.findOne({ url: id }).populate({
        path: 'violations',
        model: 'Pilot',
        match: {
          lastSeen: { $gte: pilotsAfter.toISOString() },
        },
        populate: {
          path: 'drone',
          model: 'Drone',
        },
      })
      return result
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
