const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const mongoose = require('mongoose');
const Article = mongoose.model('article');
const ArticleType = require('./article_type');


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addArticle: {
      type: ArticleType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve(parentValue, { title }) {
        return (new Article({ title })).save()
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
