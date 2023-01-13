import { gql } from 'apollo-server'
import pkg from 'lodash'
const { merge } = pkg

import bird from './queries/Bird.js'
import nest from './types/Nest.js'
import pilot from './types/Pilot.js'
import drone from './types/Drone.js'
import sensor from './queries/SensorApi.js'
import nestQuery from './queries/nest.js'

const rootTypeDefs = gql`
  type Query {
    root: String
  }
  type Subscription {
    root: String
  }
`

export const typeDefs = [
  rootTypeDefs,
  bird.typeDefs,
  nest.typeDefs,
  pilot.typeDefs,
  drone.typeDefs,
  sensor.typeDefs,
  nestQuery.typeDefs,
]

export const resolvers = merge(
  bird.resolvers,
  sensor.resolvers,
  nestQuery.resolvers
)
