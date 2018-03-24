const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean } = graphql;
const { GraphQLDateTime } =  require('graphql-iso-date');
const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');
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
        publishedAt: { type: GraphQLDateTime },
        publishedByUser: {type: GraphQLBoolean},
        geotype: {type: GraphQLString},
        lat: {type: GraphQLString},
        lng: {type: GraphQLString},
      },
      resolve(parentValue, args) {
        return new Article({
            author: args.author,
            title: args.title,
            description: args.description,
            url: args.url,
            urlToImage: args.urlToImage,
            category: args.category,
            language: args.language,
            country: args.country,
            publishedAt: args.publishedAt,
            publishedByUser: args.publishedByUser,
            //lng: args.lng,
            //lat: args.lat,
            location: {
                type: args.geotype,
                coordinates: [Number(args.lng),Number(args.lat)],
            },
        }).save()
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
