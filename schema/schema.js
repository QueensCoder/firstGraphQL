const graphql = require('graphql');
const axios = require('axios');
// const _ = require('lodash'); used for static list of users

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
//GQL data types

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve(parentValue, args) {
        try {
          const companyInfo = await axios.get(
            `http://localhost:3000/companies/${parentValue.companyId}`
          );
          //to fetch associations take companyId off of the parentValue
          //also a call to the db is required via axios
          //two get request were made 1 for users 1 for company
          return companyInfo.data;
        } catch (err) {
          console.log(err);
        }
      }
    }
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
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLInt } },
      async resolve(parentValue, args) {
        try {
          const res = await axios.get(
            `http://localhost:3000/companies/${args.id}`
          );
          return res.data;
        } catch (err) {
          console.log(err, '><><><><><>-----<><><><><><');
        }
      }
    }
  }
});

//root query tells graphQL where to enter the graph
//root query is basically our outline for the query that will be used
//root query goes into usertype then the next step is into company type
//GQL is unidirectional

//we use the library json-server in developement to simulate an external data source

module.exports = new GraphQLSchema({
  query: RootQuery
});
