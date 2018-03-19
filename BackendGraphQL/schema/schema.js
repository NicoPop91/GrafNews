const graphql = require('graphql');
const mongoose = require('mongoose');
const _ = require('lodash'); //Macht "_.xxx" Syntax, Library um mit arrays, objects etc zu arbeiten
const axios = require('axios'); // Promise based HTTP client for the browser and node.js
const mutations = require('./mutations');
const ArticleType = require('./article_type');
const Article = mongoose.model('article');
const { GraphQLDateTime } =  require('graphql-iso-date');
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
      args: {
          date: {
            type: GraphQLDateTime,  
          },
      },
      resolve(parentValue,args) {
        if(args.date){
            /*Article.find({
                "publishedAt": {"$lte": {"$date": new Date(args.date)}}
                 }).limit(50).then((result)=>{console.log(result)});*/
            return Article.where('publishedAt').lte(args.date).sort('-publishedAt').limit(100);
        }
        //return Article.find({});
        let d = new Date();
        d.setHours(d.getHours()-2);
        //console.log(d);
        return Article.where('publishedAt').gte(d).sort('-publishedAt').limit(100);
      }
    },
    article: {
      type: ArticleType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Article.findById(id);
      }
    },
  /*  newArticles: {
      type: new GraphQLList(ArticleType),
      args: { }
      resolve() {
        return Article.find({});
      }
    } */
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations
});
