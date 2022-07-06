const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const express = require('express');
const { MongoClient } = require('mongodb');

// env path setting
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

// graphql schema & resolver
const typeDefs = fs.readFileSync('./typeDefs.graphql', {
  encoding: 'utf8',
});
const resolvers = require('../resolvers');

// get Context
const getContextByGithubToken = async (githubToken) => {
  const { DB_HOST } = process.env;
  const client = await MongoClient.connect(DB_HOST, { useNewUrlParser: true });
  const db = client.db();
  const currentUser = await db.collection('users').findOne({ githubToken });
  return { db, currentUser };
};

const getDBContext = async () => {
  const { DB_HOST } = process.env;
  const client = await MongoClient.connect(DB_HOST, { useNewUrlParser: true });
  const db = client.db();
  return { db };
};

// start server
const startServer = async (typeDefs, resolvers) => {
  const context = await getDBContext();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });
  await server.start();

  const app = express();
  server.applyMiddleware({ app, path: '/graphql' });

  app.get('/', (req, res) => res.end('PhotoShare API에 오신 것을 환영합니다.'));
  app.get('/playground', expressPlayground({ endpoint: server.graphqlPath }));

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer(typeDefs, resolvers);
