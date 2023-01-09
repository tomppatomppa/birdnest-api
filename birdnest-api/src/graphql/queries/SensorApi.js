import { AuthenticationError, gql } from 'apollo-server'
import { GraphQLError } from 'graphql'

import Bird from '../../models/Bird.js'
import Pilot from '../../models/Pilot.js'
import Drone from '../../models/Drone.js'
import Nest from '../../models/Nest.js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { parseXmlToJsonObject } from '../../config/utils.js'
import { pilotsBaseUrl } from '../../config/constants.js'

import { PubSub, withFilter } from 'graphql-subscriptions'
const pubsub = new PubSub()

dotenv.config()

const API_KEY = process.env.API_KEY

const defaultBird = 'Monadikuikka'

const getResponseAsDroneObjects = async (url) => {
  const nestdata = await fetch(`http://${url}`)
  const body = await nestdata.text()
  return parseXmlToJsonObject(body)
}
const getPilotData = async (serialNumber) => {
  const response = await fetch(`${pilotsBaseUrl}/${serialNumber}`)

  if (!response.ok) {
    throw new GraphQLError('Pilot data is unavailable, try again later.', {
      extensions: { code: 'UNAVAILABLE' },
    })
  }
  const result = await response.json()
  return result
}

/**
 * Update Pilot information or, create new if doesn't exists
 * Returns the updated, or new Pilot
 */
const findOrCreatePilot = async (pilot, lastSeen, drone) => {
  const pilotUpdated = await Pilot.findOneAndUpdate(
    { pilotId: pilot.pilotId },
    {
      $set: {
        ...pilot,
        lastSeen: lastSeen,
        drone: drone,
      },
    },
    { upsert: true, returnDocument: 'after' }
  )
  return pilotUpdated
}
const findOrCreateDrone = async (drone) => {
  let droneExists = await Drone.findOne({
    serialNumber: drone.serialNumber,
  })

  //Create new Drone if it doesn't exist in database
  if (!droneExists) {
    droneExists = new Drone({
      ...drone,
    })
    await droneExists.save()
  } else if (drone.confirmedDistance < droneExists.confirmedDistance) {
    /**
     * if distance is less then previously, update closest confirmed distance
     */
    droneExists.confirmedDistance = drone.confirmedDistance
    await droneExists.save()
  }

  return droneExists
}
export const typeDefs = gql`
  type updatedPilot {
    url: String
    pilot: Pilot
  }
  extend type Query {
    getSensorData(apiKey: String!): String
  }
  extend type Subscription {
    pilotUpdated(nestUrl: String): updatedPilot
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

      await Promise.allSettled(
        drones.map(async (drone) => {
          const { snapshotTimestamp } = drone
          const result = await getPilotData(drone.serialNumber)

          const droneExists = await findOrCreateDrone(drone)
          const pilot = await findOrCreatePilot(
            result,
            snapshotTimestamp,
            droneExists
          )
          /**
           * If a violation occured, add the pilot to violations array
           * $addToSet to avoid duplicate data
           */
          if (droneExists.confirmedDistance < firstNest.noFlyZoneMeters) {
            const { url } = await Nest.findOneAndUpdate(
              { _id: firstNest._id },
              { $addToSet: { violations: pilot } },
              { returnDocument: 'after' }
            )
            const pilotTobePublished = await pilot.populate('drone')
            const pilotUpdated = {
              url,
              pilot: pilotTobePublished,
            }

            pubsub.publish('PILOT_UPDATED', {
              pilotUpdated: pilotUpdated,
            })
          }
        })
      )

      return 'Access to call api granted'
    },
  },
  Subscription: {
    pilotUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('PILOT_UPDATED'),
        (payload, variables) => {
          console.log(payload)
          return payload.pilotUpdated.url === variables.nestUrl
        }
      ),
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
