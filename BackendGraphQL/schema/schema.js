const graphql = require('graphql');
const mongoose = require('mongoose');
const _ = require('lodash'); //Macht "_.xxx" Syntax, Library um mit arrays, objects etc zu arbeiten
const axios = require('axios'); // Promise based HTTP client for the browser and node.js
const mutations = require('./mutations');
const ArticleType = require('./article_type');
const GeoCodeResponseType = require('./geocode_type');
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

const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyBx2m31Lm52LARlfQr70vugOYBhonwdHYo', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

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
                        ...(args.publishedByUser !== undefined) && {
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
                        ...(args.lng && args.lat) && {
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
        geocode: {
            type: new GraphQLList(GeoCodeResponseType),
            args: {
                address: {
                    type: GraphQLString
                },
                lat: {
                    type: GraphQLString
                },
                lng: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                if (args.address) {
                    return geocoder.geocode(args.address)
                        .then(function (res) {
                            console.log(res);
                            return res;
                        })
                        .catch(function (err) {
                            console.log(err);
                        });

                }
                if (args.lat && args.lng) {
                    return geocoder.reverse({
                            lat: args.lat,
                            lon: args.lng
                        })
                        .then(function (res) {
                            console.log(res);
                            return res;
                        })
                        .catch(function (err) {
                            console.log(err);
                        });

                }
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutations
});
