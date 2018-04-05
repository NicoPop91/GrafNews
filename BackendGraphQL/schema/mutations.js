const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt
} = graphql;
const {
    GraphQLDateTime
} = require('graphql-iso-date');
const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');
const Article = mongoose.model('article');
const ArticleType = require('./article_type');
const PushTokenResponseType = require('./push_token_response_type');
const Expo = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

// Create the messages that you want to send to clents
let messages = [];





const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addArticle: {
            type: ArticleType,
            args: {
                author: {
                    type: GraphQLString
                },
                title: {
                    type: GraphQLString
                },
                description: {
                    type: GraphQLString
                },
                url: {
                    type: GraphQLString
                },
                urlToImage: {
                    type: GraphQLString
                },
                category: {
                    type: GraphQLString
                },
                language: {
                    type: GraphQLString
                },
                country: {
                    type: GraphQLString
                },
                publishedAt: {
                    type: GraphQLDateTime
                },
                publishedByUser: {
                    type: GraphQLBoolean
                },
                geotype: {
                    type: GraphQLString
                },
                lat: {
                    type: GraphQLString
                },
                lng: {
                    type: GraphQLString
                },
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
                    location: {
                        type: args.geotype,
                        coordinates: [Number(args.lng), Number(args.lat)],
                    },
                }).save()
            }
        },
        deleteArticle: {
            type: ArticleType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parentValue, {
                id
            }) {
                return Article.remove({
                    _id: id
                });
            }
        },
        push: {
            type: PushTokenResponseType,
            args: {
                token: {
                    type: GraphQLString
                },
                text: {
                    type: GraphQLString
                },
                timeToWait: {
                    type: GraphQLInt
                }
            },
            resolve(parentValue, args) {
                let error = false;
                if (!Expo.isExpoPushToken(args.token)) {
                    console.error(`Push token ${args.token} is not a valid Expo push token`);
                    error = true;

                }
                // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
                if(!args.timeToWait){
                    args.timeToWait=100;
                }
                if(!args.text){
                    args.text='This is some Testnotification. Pls submit your the text you would like to have returned';
                }
                if (!error)
                    setTimeout(() => {
                        messages.push({
                            to: args.token,
                            sound: 'default',
                            body: args.text,
                            data: {
                                randomImageUrl: 'https://source.unsplash.com/random'
                            },
                        })
                    }, args.timeToWait)
                let chunks = expo.chunkPushNotifications(messages);

                (async () => {
                    // Send the chunks to the Expo push notification service. There are
                    // different strategies you could use. A simple one is to send one chunk at a
                    // time, which nicely spreads the load out over time:
                    for (let chunk of chunks) {
                        try {
                            let receipts = await expo.sendPushNotificationsAsync(chunk);
                            console.log(receipts);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    messages=[];
                })();
                return {
                    status: (!error) ? "ok" : "Push token " + args.token + " is not a valid Expo push token"
                };
            }
        }
    }
});

module.exports = mutation;
