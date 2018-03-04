const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({      //fields wird zur Funktion gemacht, weil sonst UserType noch nicht definiert wurde
    id: { type: GraphQLString },
    name: { type: GraphQLString },
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
