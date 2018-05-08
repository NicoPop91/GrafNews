const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const Article = mongoose.model('article');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');
const NewsAPI = require('newsapi');
//const newsapi = new NewsAPI('188776de06144080885d5b3f324f05e7');
let apiKeyIndex = 1;
let newsapi = new NewsAPI('aa8d9ecd389b4f358eb9c411ffa14724');

const app = express();

//const MONGO_URI = 'mongodb://192.168.178.39:27017/NewsDB/';
const MONGO_URI = 'mongodb://localhost:27017/MyDatabase';
// const MONGO_URI = 'https://g4qr3mtniplvry1i.myfritz.net:27017/NewsDB';
// const MONGO_URI = 'mongodb://192.168.99.100:32768/MyDatabase';
// https://g4qr3mtniplvry1i.myfritz.net:27017/NewsDB
// const MONGO_URI = 'mongodb://g4qr3mtniplvry1i.myfritz.net:27017/MyDatabase';
// const MONGO_URI = 'mongodb://192.168.99.100:32809/MyDatabase';
//const MONGO_URI = 'mongodb://g4qr3mtniplvry1i.myfritz.net:27017/MyDatabase';
// const MONGO_URI = 'http://9p7wpw3ppo75fifx.myfritz.net:4000/playground';
if (!MONGO_URI) {
    throw new Error('You must provide a MongoLab URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, {
  useMongoClient: true,
  /* other options */
});
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));


//sagt express, dass bei jedem request an /graphql GraphQL benutzt werden soll
app.use(bodyParser.json());
app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening');
});

// News von der API pullen
// articles = Array in der Response der News API
// response = JSON der News API
// Article = Mongoose Model
// news = individueller Artikel aus dem Result

const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const countries = ['de', 'us', 'gb','at'];
const languages = ['de', 'en']
setInterval(() => {
    categories.forEach((category) => {
        languages.forEach((language) => {
            countries.forEach((country) => {


                if (!((country === 'de' && language === 'en') || (country === 'us' && language === 'de') || (country === 'gb' && language === 'de')||(country === 'at' && language === 'en'))) {
                    newsapi.v2.topHeadlines({
                        category: category,
                        language: language,
                        country: country,
                    }).then((response) => {
                        return response.articles;
                    }).then((articles) => {
                        articles.forEach((news) => {
                            console.log(news);
                            Article.find({
                                    title: news.title
                                })
                                .then((result) => {
                                    if (result.length == 0) {
                                        new Article({
                                            title: news.title,
                                            author: news.source.name,
                                            description: news.description,
                                            url: news.url,
                                            urlToImage: news.urlToImage,
                                            publishedAt: new Date(news.publishedAt),
                                            category: category,
                                            country: country,
                                            language: language,
                                            publishedByUser: false,
                                            //lng: null,
                                            //lat: null,
                                            /*location: {
                                                type: "Point",
                                                point: [null,null]
                                            },*/
                                        }).save();
                                    }
                                });
                        });
                    }).catch((err)=>{
                        if(err){
                            //APIKey 1 ea30eaed8d1d45e3828339efc4a12c08
                            //APIKey 2 aa8d9ecd389b4f358eb9c411ffa14724
                            //APIKey 3 bdeb31f66ff14026ae9db0a657aafa42
                            apiKeyIndex++;
                            if(apiKeyIndex=6){
                                newsapi = new NewsAPI('ea30eaed8d1d45e3828339efc4a12c08');
                                apiKeyIndex=1;
                            }
                            if(apiKeyIndex=2){
                               newsapi = new NewsAPI('aa8d9ecd389b4f358eb9c411ffa14724'); 
                            }
                            if(apiKeyIndex=3){
                                newsapi = new NewsAPI('bdeb31f66ff14026ae9db0a657aafa42');
                            }
                            if(apiKeyIndex=4){
                                newsapi = new NewsAPI('722504dd56e546b09ad7f5d890c5d55b');
                            }
                            if(apiKeyIndex=5){
                                newsapi = new NewsAPI('8fd6c59bab554af39cd2ed4d18439e92');
                            }
                        }
                    });

                }


            });
        });
    });
},780000 ); //1560000
