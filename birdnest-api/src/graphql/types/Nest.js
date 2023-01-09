import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Nest {
    positionY: Float
    positionX: Float
    url: String
    noFlyZoneMeters: Float
    violations: [Pilot]
  }
`

export const resolvers = {}

export default {
  typeDefs,
  resolvers,
}
