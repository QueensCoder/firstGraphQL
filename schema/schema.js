const graphql = require('graphql');
const axios = require('axios');
// const _ = require('lodash'); used for static list of users

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
//GQL data types

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLInt } },
      async resolve(parentValue, args) {
        try {
          const res = await axios.get(`http://localhost:3000/users/${args.id}`);
          return res.data;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
});

//root query tells graphQL where to enter the graph

module.exports = new GraphQLSchema({
  query: RootQuery
});
