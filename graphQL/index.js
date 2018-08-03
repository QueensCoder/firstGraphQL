const { GraphQLSchema } = require('graphql');
const mutation = require('./operations/mutation');
const RootQuery = require('./operations/rootQuery');

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
