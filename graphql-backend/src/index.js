//const fetch = require('node-fetch');
const {
    GraphQLServer
} = require('graphql-yoga');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('188776de06144080885d5b3f324f05e7');
const mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.99.100:32769/MyDatabase');
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ArticleSchema = new Schema({
        title: {
            type: String
        },
        description: {
            type: String
        },
        url: {
            type: String
        },
        urlToImage: {
            type: String
        },
        category: {
            type: String
        },
        language: {
            type: String
        },
        country: {
            type: String
        },
        publishedAt: {
            type: String
        }
    }, {
        usePushEach: true
    } // verhindert $pushAll und fixt alle Probleme von weiter unten!
);

const Article = mongoose.model('article', ArticleSchema);

const typeDefs = `
  type Query {
    getNews(options: [ArticleOption!]!): [[Article!]!]!,
    getSources(options: [SourceOption!]!): [[Source!]!]!,
    getAllArticles: [Article!],
    getArticle(_id: String):Article,
  },
  
  type Mutation{
    createArticle(title: String, description: String):Article!,
    deleteArticle(_id: String):Article,
  },

  type Article {
    _id: String,
    source: Source,
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
  },
  type Source {
    id: String,
    name: String,
    description: String,
    url: String,
    category: String,
    language: String,
    country: String
  },
  input SourceOption{
    id: String,
    category: String,
    language: String,
    country: String,
  }
  input ArticleOption{
    q: String,
    sources: String,
    category: String,
    country: String,
  }
`

const opts = {
    port: 4000, //configurable port no
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
}
const context = {
    //apiKey: '188776de06144080885d5b3f324f05e7',
}

const resolvers = {
    Query: {
        getAllArticles: (_, {}) => {
            return Article.find({});
        },
        getArticle: (_, id) => {
            return Article.findById(id);
        },
        /*getNews: (_, {
            options
        }) => {
            let url = 'http://newsapi.org/v2/top-headlines?' +
                'country=de&' +
                'apiKey=' + context.apiKey;
            return fetch(url).then((response) => {
                return response.json().then((array) => {
                    return array.articles
                })
            });
        },*/
        getNews: (_, {
            options
        }) => {
            let result = [];
            options.forEach((option) => {
                result.push(
                    newsapi.v2.topHeadlines({
                        sources: option.sources,
                        q: option.q,
                        category: option.category,
                        language: option.language,
                        country: option.country
                    }).then((response) => {
                        console.log(response);
                        return response.articles;
                    })
                )
            });
            return Promise.all(result).then((result) => {
                //console.log(result);
                return result
            });
        },
        getSources: (_, {
            options
        }) => {
            let result = [];
            options.forEach((option) => {
                result.push(newsapi.v2.sources({
                    category: option.category,
                    language: option.language,
                    country: option.country
                }).then((response) => {
                    console.log(response);
                    return response.sources;
                }));
            });
            return Promise.all(result).then((result) => {
                //console.log(result);
                return result
            });
        },
    },
    Mutation: {
        createArticle: (_, {
            title,
            description
        }) => {
            return (new Article({
                title: title,
                description: description
            })).save();
        },
        deleteArticle: (_, _id) => {
            Article.remove({
                _id: _id
            }).then(() => {
                return Article.findById(_id)
            });
            //return Article.find({});
        },
    },
}



setInterval(() => {
    newsapi.v2.topHeadlines({
        category: 'general',
        language: 'de',
        country: 'de',
    }).then((response) => {
        //console.log(response);
        return response.articles;
    }).then((articles) => {
        articles.forEach((article) => {
            Article.find({
                    description: article.description
                })
                .then((result) => {
                    //console.log(result.length);
                    if (result.length == 0) {
                        new Article({
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            urlToImage: article.urlToImage,
                            publishedAt: article.publishedAt,
                            category: 'general',
                            country: 'de',
                            language: 'de',
                        }).save();
                    }
                });
        });
    });
    newsapi.v2.topHeadlines({
        category: 'general',
        language: 'en',
        country: 'us',
    }).then((response) => {
        //console.log(response);
        return response.articles;
    }).then((articles) => {
        articles.forEach((article) => {
            Article.find({
                    description: article.description
                })
                .then((result) => {
                    //console.log(result.length);
                    if (result.length == 0) {
                        new Article({
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            urlToImage: article.urlToImage,
                            publishedAt: article.publishedAt,
                            category: 'general',
                            country: 'us',
                            language: 'en',
                        }).save();
                    }
                });
        });
    });
}, 5000);

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context
})
server.start(opts, () => console.log(`Server is running at http://localhost:${opts.port}`))
