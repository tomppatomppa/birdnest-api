import dotenv from 'dotenv'

import { sendRequestToGraphqlEndpoint } from './config/utils.js'
import { InitDatabase } from './config/db.js'
import { createApolloServer } from './config/apolloServer.js'
import Nest from './models/Nest.js'
import Pilot from './models/Pilot.js'
import Drone from './models/Drone.js'

dotenv.config()

InitDatabase() //Initialize mongodb

createApolloServer() //create and start apollo server

//Send request every 5 seconds
// setInterval(() => {
//   sendRequestToGraphqlEndpoint()
// }, 5000)

// await Pilot.deleteMany({})
// await Drone.deleteMany({})
// const found = await Nest.findOne({
//   url: 'assignments.reaktor.com/birdnest/drones',
// })
// found.violations = []
// await found.save()
// console.log(found)
