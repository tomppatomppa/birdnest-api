import { ApolloServer, gql } from 'apollo-server'

const data = [{ id: 1, name: 'Bird' }]

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

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
