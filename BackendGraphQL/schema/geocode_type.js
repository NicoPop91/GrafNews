const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLBoolean, GraphQLFloat } = graphql;
const { GraphQLDateTime } =  require('graphql-iso-date');
const { PointObject } = require('graphql-geojson');


const GeoCodeResponseType = new GraphQLObjectType({
  name: 'GeoCodeResponse',
  fields: () => ({
      //status: {type: GraphQLString}
      formattedAddress:{type: GraphQLString},
      latitude: {type: GraphQLFloat},
      longitude: {type: GraphQLFloat},
      country: {type: GraphQLString},
      countryCode: {type: GraphQLString},
      city: {type: GraphQLString},
      zipcode: {type: GraphQLString},
      streetName: {type: GraphQLString},
      streetNumber: {type: GraphQLString},
      administrativeLevels: {type: administrativeLevel},
      extra: {type: extra},
      provider: {type: GraphQLString},
  })
});

const administrativeLevel = new GraphQLObjectType({
    name: 'administrativeLevel',
    fields: ()=>({
        level1long: {type: GraphQLString},
        level1short: {type: GraphQLString},
        level2long: {type: GraphQLString},
        level2short: {type: GraphQLString},
        level3long: {type: GraphQLString},
        level3short: {type: GraphQLString}
    })
});

const extra = new GraphQLObjectType({
   name:"extra",
    fields:()=>({
        googlePlaceId: {type: GraphQLString}
    })
});

module.exports = GeoCodeResponseType;