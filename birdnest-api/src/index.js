import { ApolloServer, gql } from 'apollo-server'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const data = [{ id: 1, name: 'Bird' }]

const MONGODB_URI = process.env.MONGODB_URI

console.log('Connecting to', MONGODB_URI)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const resolvers = {
  Query: {
    allBirds: () => data,
    findBird: (root, args) => data.find((b) => b.name === args.name),
  },
}
const typeDefs = gql`
  type Bird {
    name: String!
    id: ID!
  }
  type Query {
    allBirds: [Bird!]!
    findBird(name: String): Bird!
  }
`
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
