const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = require('graphql');
const axios = require('axios');
const { UserType, CompanyType } = require('../schema');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        //must provide name and age or else error
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLInt }
      },
      async resolve(parentValue, args) {
        const { firstName, age } = args;
        try {
          const newUser = await axios.post('http://localhost:3000/users', {
            firstName,
            age
          });
          return newUser.data;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
});

module.exports = mutation;
