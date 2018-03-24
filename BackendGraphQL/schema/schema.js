const graphql = require('graphql');
const mongoose = require('mongoose');
const _ = require('lodash'); //Macht "_.xxx" Syntax, Library um mit arrays, objects etc zu arbeiten
const axios = require('axios'); // Promise based HTTP client for the browser and node.js
const mutations = require('./mutations');
const ArticleType = require('./article_type');
const Article = mongoose.model('article');
const {
    GraphQLDateTime
} = require('graphql-iso-date');
const {
    PointObject
} = require('graphql-geojson');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean,
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
                lng: {
                    type: GraphQLString,
                },
                lat: {
                    type: GraphQLString,
                },
                publishedByUser: {
                    type: GraphQLBoolean
                },
            },
            resolve(parentValue, args) {
                if (args.date) {
                    if (args.lng && args.lat) {
                        if (args.publishedByUser === true) {
                            return Article.find({
                                "location": {
                                    "$near": {
                                        "$geometry": {
                                            "type": "Point",
                                            "coordinates": [Number(args.lng), Number(args.lat)]
                                        },
                                        "$maxDistance": 20000,
                                        "$minDistance": 0
                                    }
                                },
                                "publishedAt": {
                                    "$lte": new Date(args.date)
                                },
                                publishedByUser: true,
                            }).sort('-publishedAt').limit(100);
                        }
                        if (args.publishedByUser === false) {
                            return Article.find({
                                "location": {
                                    "$near": {
                                        "$geometry": {
                                            "type": "Point",
                                            "coordinates": [Number(args.lng), Number(args.lat)]
                                        },
                                        "$maxDistance": 20000,
                                        "$minDistance": 0
                                    }
                                },
                                "publishedAt": {
                                    "$lte": new Date(args.date)
                                },
                                publishedByUser: false,
                            }).sort('-publishedAt').limit(100);
                        }
                        return Article.find({
                            "location": {
                                "$near": {
                                    "$geometry": {
                                        "type": "Point",
                                        "coordinates": [Number(args.lng), Number(args.lat)]
                                    },
                                    "$maxDistance": 20000,
                                    "$minDistance": 0
                                }
                            },
                            "publishedAt": {
                                "$lte": new Date(args.date)
                            }
                        }).sort('-publishedAt').limit(100);
                    }
                    if (args.publishedByUser === true) {
                        return Article.find({
                            publishedAt: {
                                $lte: new Date(args.date)
                            },
                            publishedByUser: true,
                        }).sort('-publishedAt').limit(100);
                    }
                    if (args.publishedByUser === false) {
                        return Article.find({
                            publishedAt: {
                                $lte: new Date(args.date)
                            },
                            publishedByUser: false,
                        }).sort('-publishedAt').limit(100);
                    }
                    /*Article.find({
                        "publishedAt": {"$lte": {"$date": new Date(args.date)}}
                         }).limit(50).then((result)=>{console.log(result)});*/
                    return Article.where('publishedAt').lte(args.date).sort('-publishedAt').limit(100);
                }
                //return Article.find({});
                let d = new Date();
                d.setHours(d.getHours() - 2);
                //console.log(d);
                return Article.where('publishedAt').gte(d).sort('-publishedAt').limit(100);
            }
        },
        article: {
            type: ArticleType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parentValue, {
                id
            }) {
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
