
const { ApolloServer } = require("apollo-server");

const express= require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express()

const typeDefs = require('./graphQL/typeDefs')
const resolvers = require('./graphQL/resolvers')

const PORT = process.env.PORT || 5000;

const uri = process.env.MONGO_URI;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req})
});

mongoose
.connect(uri, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port : PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err =>{
    console.error(err)
  });
