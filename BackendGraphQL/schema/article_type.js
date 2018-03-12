const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    url: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    category: { type: GraphQLString },
    language: { type: GraphQLString },
    country: { type: GraphQLString },
    publishedAt: { type: GraphQLString }
  })
});

module.exports = ArticleType;
