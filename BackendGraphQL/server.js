const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const Article = mongoose.model('article');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');
const NewsAPI = require('newsapi');
//const newsapi = new NewsAPI('188776de06144080885d5b3f324f05e7');
const newsapi = new NewsAPI('aa8d9ecd389b4f358eb9c411ffa14724');

const app = express();


const MONGO_URI = 'mongodb://192.168.99.100:32768/MyDatabase';
//const MONGO_URI = 'mongodb://g4qr3mtniplvry1i.myfritz.net:27017/MyDatabase';
// const MONGO_URI = 'http://9p7wpw3ppo75fifx.myfritz.net:4000/playground';
if (!MONGO_URI) {
    throw new Error('You must provide a MongoLab URI');
}


mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
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
const countries = ['de', 'us', 'gb'];
const languages = ['de', 'en']
setInterval(() => {
    categories.forEach((category) => {
        languages.forEach((language) => {
            countries.forEach((country) => {
                
                
                if (!((country === 'de' && language === 'en') || (country === 'us' && language === 'de') || (country === 'gb' && language === 'de'))) {
                    newsapi.v2.topHeadlines({
                        category: category,
                        language: language,
                        country: country,
                    }).then((response) => {
                        //    console.log(response);
                        return response.articles;
                    }).then((articles) => {
                        articles.forEach((news) => {
                            //    console.log(news.title);
                            Article.find({
                                    title: news.title
                                })
                                .then((result) => {
                                    //console.log(result.length + " hallo");
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
                                        }).save();
                                    }
                                });
                        });
                    });
                    
                }
                
                
            });
        });
    });
},1560000 ); //1560000

// suche ist Array mit komplettem Newsartikel
// Tatverdächtiger schweigt bei Haftrichter
/*Article.find({title: 'Tatverdächtiger schweigt bei Haftrichter'})
.then((suche) => {
  if( suche.length == 0){
    console.log("Gleich!")
  }
  console.log(suche.length) });*/
