import { ApolloServer, gql } from "apollo-server-express";
import TechDataSource from "./datasources/TechDataSource";
import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import TechDataContext from "../data/TechDataContext";

const typeDefs = gql`
  type Tech {
    id: ID!
    name: String
  }
  type Skill {
    id: ID!
    tech: Tech!
    rating: Int
  }
  type Query {
    tech: [Tech]
    skills: [Skill]
  }

  #   type Mutation {
  #     addTech(name: String): Tech!
  #     addSkill(skill: Skill): Skill!
  #   }
`;

const resolvers = {
  Query: {
    tech: (
      _: any,
      args: any,
      context: { dataSources: { techApi: TechDataSource } },
      info: any
    ) => {
    //   console.log("[REQUEST]", _);
    //   console.log("[ARGS]", args);
    //   console.log("[INFO]", info);
    //   console.log("[CONTEXT]", dataSources);
      return context.dataSources.techApi.getAllTech();
    },
  },
};

interface IDataSources {
  techApi: TechDataSource;
}

const dataSources: DataSources<IDataSources> = {
  techApi: new TechDataSource(new TechDataContext()),
  techApi2: new TechDataSource(new TechDataContext()),
};

export default new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => dataSources,
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
