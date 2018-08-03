const axios = require('axios');
const { UserType, CompanyType } = require('../schema');
const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = require('graphql');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      //POST
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
    },
    deleteUser: {
      //DELETE
      type: UserType,
      args: { id: { type: GraphQLInt } },
      async resolve(parentValue, args) {
        const { id } = args;
        try {
          const deletedUser = await axios.delete(
            `http://localhost:3000/users/${id}`
          );
          return deletedUser.data;
        } catch (err) {
          console.log(err);
        }
      }
    },
    updateUser: {
      //PATCH
      //would usually be PUT but we are running two servers here
      //our json db server might be the reason why PUT completely OVERWRITES
      //while PATCH just updates
      type: UserType,
      args: {
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLInt }
      },
      async resolve(parentValue, args) {
        const { id, firstName, age, companyId } = args;
        try {
          const updatedUser = await axios.patch(
            `http://localhost:3000/users/${id}`,
            {
              firstName,
              age,
              companyId
            }
          );
          return updatedUser.data;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
});

module.exports = mutation;
