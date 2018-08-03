const graphql = require('graphql');
const axios = require('axios');
// const _ = require('lodash'); used for static list of users

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = graphql;
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
        const { id } = parentValue;
        try {
          const userInfo = await axios.get(
            `http://localhost:3000/companies/${id}/users`
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
        const { companyId } = parentValue;
        try {
          const companyInfo = await axios.get(
            `http://localhost:3000/companies/${companyId}`
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

module.exports = { UserType, CompanyType };
