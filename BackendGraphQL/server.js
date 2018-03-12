const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');

const app = express();


const MONGO_URI = 'mongodb://localhost:27017/NewsDB';
// const MONGO_URI = 'http://9p7wpw3ppo75fifx.myfritz.net:4000/playground';
if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}


mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));


//sagt express, dass bei jedem request an /graphql GraphQL benutzt werden soll
app.use(bodyParser.json());
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Listening');
});
