const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const { GraphQLDateTime } =  require('graphql-iso-date');
const mongoose = require('mongoose');
const Article = mongoose.model('article');
const ArticleType = require('./article_type');


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addArticle: {
      type: ArticleType,
      args: {
        author: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        url: { type: GraphQLString },
        urlToImage: { type: GraphQLString },
        category: { type: GraphQLString },
        language: { type: GraphQLString },
        country: { type: GraphQLString },
        publishedAt: { type: GraphQLDateTime }
      },
      resolve(parentValue, args) {
        return (new Article( args )).save()
      }
    },
    deleteArticle: {
      type: ArticleType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return Article.remove({ _id: id });
      }
    }
  }
});

module.exports = mutation;
