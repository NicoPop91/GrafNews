const graphql = require('graphql');
<<<<<<< HEAD
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } = graphql;
=======
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
>>>>>>> c82b1bda91582f44c6a787ccc4ecc78ca2776ab0
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
<<<<<<< HEAD
        title: { type: new GraphQLNonNull(GraphQLString) },
=======
        author: { type: GraphQLString },
        title: { type: GraphQLString },
>>>>>>> c82b1bda91582f44c6a787ccc4ecc78ca2776ab0
        description: { type: GraphQLString },
        url: { type: GraphQLString },
        urlToImage: { type: GraphQLString },
        category: { type: GraphQLString },
        language: { type: GraphQLString },
        country: { type: GraphQLString },
        publishedAt: { type: GraphQLDateTime }
      },
      resolve(parentValue, args) {
<<<<<<< HEAD
        return (new Article(args)).save()
=======
        return (new Article( args )).save()
>>>>>>> c82b1bda91582f44c6a787ccc4ecc78ca2776ab0
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
