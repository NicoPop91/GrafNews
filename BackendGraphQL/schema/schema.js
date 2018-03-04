const graphql = require('graphql');
const mongoose = require('mongoose');
const _ = require('lodash'); //Macht "_.xxx" Syntax, Library um mit arrays, objects etc zu arbeiten
const axios = require('axios'); // Promise based HTTP client for the browser and node.js
const mutations = require('./mutations');
const ArticleType = require('./article_type');
const Article = mongoose.model('article');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    articles: {
      type: new GraphQLList(ArticleType),
      resolve() {
        return Article.find({});
      }
    },
    article: {
      type: ArticleType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Article.findById(id);
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations
});
