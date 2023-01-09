import { AuthenticationError, gql } from 'apollo-server'
import { GraphQLError } from 'graphql'

import Bird from '../../models/Bird.js'

import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { parseXmlToJsonObject } from '../../config/utils.js'

dotenv.config()

const API_KEY = process.env.API_KEY

const defaultBird = 'Monadikuikka'

const getResponseAsDroneObjects = async (url) => {
  const nestdata = await fetch(`http://${url}`)
  const body = await nestdata.text()
  return parseXmlToJsonObject(body)
}

export const typeDefs = gql`
  extend type Query {
    getSensorData(apiKey: String!): String
  }
`
export const resolvers = {
  Query: {
    getSensorData: async (_, { apiKey }) => {
      if (apiKey !== API_KEY) {
        throw new AuthenticationError('Invalid Api key')
      }
      //For the sake of the task hardcode to find "Monadinkuikka"
      const birdExists = await Bird.findOne({ name: defaultBird }).populate(
        'protectedNests'
      )
      if (!birdExists) {
        throw new GraphQLError(`Bird ${defaultBird} does not exist`)
      }
      //Get the first nest
      const [firstNest] = birdExists.protectedNests
      const drones = await getResponseAsDroneObjects(firstNest.url)
      console.log(drones)
      return 'Access to call api granted'
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
