const app = require('express')();
const expressGraphQL = require('express-graphql');
const schema = require('./graphQL');

//graphQL middleware
app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log('listening on port 4000');
});
