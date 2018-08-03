const graphql = require('graphql');
const axios = require('axios');
// const _ = require('lodash'); used for static list of users

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;
//GQL data types

//circular reference between two types
//we cant switch where they are defined because the variable is used before being defined due to const.
//probably would be undefined if we used var
// note the fields method on CompanyType it is now a function that returns the object that fields once was
//we use closure to the function is run after the file is executed
//this makes it so that both CompanyType and UserType are both defined and then graphQL will then use both types despite the circular reference.
//in the resolve function we go to companies/id/users to get a list of users
// _+_+_+_we use graphQLList so we can get a list of users since it is a one(Company) to many(users) __+_+_+_+
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: new GraphQLList(UserType),
      async resolve(parentValue, args) {
        try {
          const userInfo = await axios.get(
            `http://localhost:3000/companies/${parentValue.id}/users`
          );
          return userInfo.data;
        } catch (err) {
          console.log(err);
        }
      }
    }
  })
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
