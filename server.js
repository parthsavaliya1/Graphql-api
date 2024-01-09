const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const mongoose = require('mongoose')
const {MONGO_URI, JWT_SECRET} = require('./config')
const jwt = require('jsonwebtoken');

const {typeDefs} = require('./schemaGql') 
require('./model/Quote');
require('./model/User')

mongoose.connect(MONGO_URI,{
    useUnifiedTopology:true
})

mongoose.connection.on('connected', () => {
    console.log('Connected...')
})

mongoose.connection.on('error', (err) => {
    console.log('Errror...',err)
})

const {resolvers} = require('./resolvers')

const context = ({req})=> {
    const {authorization} = req.headers;
    if(authorization) {
      const {userId} =  jwt.verify(authorization,JWT_SECRET);
      return {userId}
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:context,
    plugins:[ApolloServerPluginLandingPageGraphQLPlayground()]
})

server.listen().then(({url})=> {
    console.log('server ready at ', url)
})