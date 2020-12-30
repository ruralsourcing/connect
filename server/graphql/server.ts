import { ApolloServer, gql } from "apollo-server-express";

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
  dataSources: () => {
    return {};
  },
});
