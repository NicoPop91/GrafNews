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
                category: {
                    type: GraphQLString
                },
                country: {
                    type: GraphQLString
                },
                language: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                if (args.date) {
                    return Article.find({
                        publishedAt: {
                            $lte: new Date(args.date)
                        },
                        ...(args.publishedByUser!==undefined) && {
                            publishedByUser: args.publishedByUser
                        },
                        ...(args.category) && {
                            category: args.category
                        },
                        ...(args.language) && {
                            language: args.language
                        },
                        ...(args.country) && {
                            country: args.country
                        },
                        ...(args.lng&&args.lat) &&{
                            "location": {
                                "$near": {
                                    "$geometry": {
                                        "type": "Point",
                                        "coordinates": [Number(args.lng), Number(args.lat)]
                                    },
                                    "$maxDistance": 20000,
                                    "$minDistance": 0
                                }
                            }
                        }
                    }).sort('-publishedAt').limit(100);
                }
                let d = new Date();
                d.setHours(d.getHours() - 2);
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
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutations
});
