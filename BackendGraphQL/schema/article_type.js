const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const { GraphQLDateTime } =  require('graphql-iso-date');


const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    url: { type: GraphQLString },
    urlToImage: { type: GraphQLString },
    category: { type: GraphQLString },
    language: { type: GraphQLString },
    country: { type: GraphQLString },
    publishedAt: { type: GraphQLDateTime }
  })
});

module.exports = ArticleType;
