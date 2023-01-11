import { AuthenticationError, gql } from 'apollo-server'
import { GraphQLError } from 'graphql'

import Bird from '../../models/Bird.js'
import Pilot from '../../models/Pilot.js'
import Drone from '../../models/Drone.js'
import Nest from '../../models/Nest.js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { parseXmlToJsonObject } from '../../config/utils.js'
import { defaultBird, pilotsBaseUrl } from '../../config/constants.js'

import { PubSub, withFilter } from 'graphql-subscriptions'
import mongoose from 'mongoose'
const pubsub = new PubSub()
import { ObjectId } from 'mongoose'
dotenv.config()

const API_KEY = process.env.API_KEY

const hasViolatedNoFlyZone = (drone, nest) => {
  //console.log(drone.confirmedDistance < nest.noFlyZoneMeters)
  return drone.confirmedDistance < nest.noFlyZoneMeters
}

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

/**
 * If pilot has previously violated the no fly zone
 * update when pilot was last seen
 */
const updatePilotLastSeen = async (drone) => {
  await Pilot.findOneAndUpdate(
    {
      drone: drone._id,
    },
    { $set: { lastSeen: drone.snapshotTimestamp } }
  )
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
      //For the sake of the task hardcode to find "Monadikuikka"
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
          const droneExists = await findOrCreateDrone(drone)

          await updatePilotLastSeen(droneExists)

          //If no violation occured for current drone do nothing
          if (!hasViolatedNoFlyZone(droneExists, firstNest)) return

          //Only fetch pilot data if a violation occurred
          const result = await getPilotData(drone.serialNumber)

          const pilot = await findOrCreatePilot(
            result,
            drone.snapshotTimestamp,
            droneExists
          )

          //Add pilot to nest violations
          const { url } = await Nest.findOneAndUpdate(
            { _id: firstNest._id },
            { $addToSet: { violations: pilot } }
          )

          const pilotWithDrone = await pilot.populate('drone')

          pubsub.publish('PILOT_UPDATED', {
            pilotUpdated: {
              url,
              pilot: pilotWithDrone,
            },
          })
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
