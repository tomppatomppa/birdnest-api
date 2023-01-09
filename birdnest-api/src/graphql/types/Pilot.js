import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Pilot {
    pilotId: String
    firstName: String
    lastName: String
    phoneNumber: String
    createdDt: String
    email: String
    drone: Drone
    lastSeen: String
  }
`

export const resolvers = {}

export default {
  typeDefs,
  resolvers,
}
