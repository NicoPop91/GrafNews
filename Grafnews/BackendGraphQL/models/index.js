const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
      title: { type: String },
      author: { type: String },
      description: { type: String },
      url: { type: String },
      urlToImage: { type: String },
      category: { type: String },
      language: { type: String },
      country: { type: String },
      publishedAt: { type: Date },
      publishedByUser: {type: Boolean},
      location: {type: mongoose.Schema.Types.Point},
    },
    { usePushEach: true } // verhindert $pushAll und fixt alle Probleme von weiter unten!
);

mongoose.model('article', ArticleSchema);
