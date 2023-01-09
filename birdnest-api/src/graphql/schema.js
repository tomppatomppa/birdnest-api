import { gql } from 'apollo-server'
import pkg from 'lodash'
const { merge } = pkg

import bird from './queries/Bird.js'

const rootTypeDefs = gql`
  type Query {
    root: String
  }
`

export const typeDefs = [rootTypeDefs, bird.typeDefs]
export const resolvers = merge(bird.resolvers)
