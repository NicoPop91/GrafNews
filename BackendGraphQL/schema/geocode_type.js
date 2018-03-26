const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLBoolean } = graphql;
const { GraphQLDateTime } =  require('graphql-iso-date');
const { PointObject } = require('graphql-geojson');


const GeoCodeResponseType = new GraphQLObjectType({
  name: 'GeoCodeResponse',
  fields: () => ({
      status: {type: GraphQLString}
  })
});

module.exports = GeoCodeResponseType;