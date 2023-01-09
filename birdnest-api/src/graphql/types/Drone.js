import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Drone {
    serialNumber: String
    model: String
    manufacturer: String
    mac: String
    ipv4: String
    ipv6: String
    firmware: String
    positionY: String
    positionX: String
    altitude: String
    snapshotTimestamp: String
    confirmedDistance: Float
  }
`

export const resolvers = {}

export default {
  typeDefs,
  resolvers,
}
