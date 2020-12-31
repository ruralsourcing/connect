import { ApolloServer, AuthenticationError, gql } from "apollo-server-express";

const typeDefs = gql`
  type Book {
    title: String
  }
  type Query {
    hello: String
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
    books: () => [
      { title: "Enders Game" },
      { title: "Farenheit 451" },
      { title: "Harry Potter" },
      { title: "Lord of the Rings" },
    ],
  },
};

export default new ApolloServer({
  typeDefs,
  resolvers,
//   dataSources: () => {
//     return {};
//   },
//   context: ({ req }) => {
//     console.log(req);
//     // get the user token from the headers
//     const token = req.headers.authorization || "";
//     console.log(token);
//     // try to retrieve a user with the token
//     const user = null;

//     // optionally block the user
//     // we could also check user roles/permissions here
//     if (!user) throw new AuthenticationError("you must be logged in");

//     // add the user to the context
//     return { user };
//   },
});
