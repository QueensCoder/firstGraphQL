const graphql = require('graphql');
const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
//GQL data types

//dummy data
const users = [
  {
    id: '1',
    name: 'Oz',
    age: 27
  },
  {
    id: '2',
    name: 'Serena',
    age: 23
  }
];

//User Schema
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { GraphQLString },
    age: { type: GraphQLInt }
  }
});

//RootQuery
//Where you enter GQL for data
//resolve goes into db and fetches data
//args.id is provided to query when it is made
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  User: {
    fields: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return _.find(users, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
