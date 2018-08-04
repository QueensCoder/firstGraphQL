const { GraphQLSchema } = require('graphql');
const mutation = require('./operations/mutation');
const RootQuery = require('./operations/rootQuery');
//see root query and mutation
//root file for all graphql operations and schema

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
