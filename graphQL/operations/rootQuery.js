const { GraphQLObjectType, GraphQLInt } = require('graphql');
const { UserType, CompanyType } = require('../schema');
const axios = require('axios');

const RootQuery = new GraphQLObjectType({
  //GET REQ
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLInt } },
      async resolve(parentValue, args) {
        const { id } = args;
        try {
          const res = await axios.get(`http://localhost:3000/users/${id}`);
          return res.data;
        } catch (err) {
          console.log(err);
        }
      }
    },
    company: {
      //GET
      type: CompanyType,
      args: { id: { type: GraphQLInt } },
      async resolve(parentValue, args) {
        const { id } = args;
        try {
          const res = await axios.get(`http://localhost:3000/companies/${id}`);
          return res.data;
        } catch (err) {
          console.log(err);
        }
      }
    }
  })
});

//root query tells graphQL where to enter the graph
//root query is basically our outline for the query that will be used
//root query goes into usertype then the next step is into company type
//GQL is unidirectional

//we use the library json-server in developement to simulate an external data source

//changes data

/*

example of query for same info for different companies while keeping code DRY
fragment key word gives us this 
{
  google: company(id: 1) {
    ...companyDetails
  },
  apple: company(id:2) {
    ...companyDetails
  }
}

          

fragment companyDetails on Company {
  id
  name
  description
}

companyDetails is an alias for info you want off the object (company is the object)

 */

module.exports = RootQuery;
