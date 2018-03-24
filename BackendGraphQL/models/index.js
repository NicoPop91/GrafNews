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
      //lat: {type: String},
      //lng: {type: String},
      /*location: {
        type: String,
        coordinates : { type: [Number], index: '2dsphere' },
      },*/
      location: {type: mongoose.Schema.Types.Point},
      /*any: mongoose.Schema.Types.GeoJSON,
      point: mongoose.Schema.Types.Point,
      multipoint: mongoose.Schema.Types.MultiPoint,
      linestring: mongoose.Schema.Types.LineString,
      multilinestring: mongoose.Schema.Types.MultiLineString,
      polygon: mongoose.Schema.Types.Polygon,
      multipolygon: mongoose.Schema.Types.MultiPolygon,
      geometry: mongoose.Schema.Types.Geometry,
      geometrycollection: mongoose.Schema.Types.GeometryCollection,
      feature: mongoose.Schema.Types.Feature,
      featurecollection: mongoose.Schema.Types.FeatureCollection,*/
    },
    { usePushEach: true } // verhindert $pushAll und fixt alle Probleme von weiter unten!
);

mongoose.model('article', ArticleSchema);
