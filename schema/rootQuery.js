const { GraphQLObjectType, GraphQLSchema, GraphQLInt } = require('graphql');
const { UserType, CompanyType } = require('./schema');
const axios = require('axios');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
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
          console.log(err);
        }
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
