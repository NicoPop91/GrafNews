const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLBoolean } = graphql;
const { GraphQLDateTime } =  require('graphql-iso-date');
const { PointObject } = require('graphql-geojson');


const PushTokenResponseType = new GraphQLObjectType({
  name: 'PushTokenResponse',
  fields: () => ({
      status: {type: GraphQLString}
  })
});

module.exports = PushTokenResponseType;