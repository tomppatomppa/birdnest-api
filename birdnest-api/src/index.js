import dotenv from 'dotenv'

import { sendRequestToGraphqlEndpoint } from './config/utils.js'
import { InitDatabase } from './config/db.js'
import { startServer } from './config/createApolloServer.js'

dotenv.config()

InitDatabase() //Initialize mongodb

startServer() //create and start apollo server

//Send request every 5 seconds
setInterval(() => {
  sendRequestToGraphqlEndpoint()
}, 5000)
