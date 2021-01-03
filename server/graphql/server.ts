import { ApolloServer, gql } from "apollo-server-express";
import TechDataSource from "./datasources/TechDataSource";
import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import TechDataContext from "../data/TechDataContext";
import SkillDataSource from "./datasources/SkillsDataSource";
import SkillDataContext from "../data/SkillDataContext";

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
    techs: [Tech]!
    tech(techId: ID!): Tech
    skills: [Skill]
  }

  #   type Mutation {
  #     addTech(name: String): Tech!
  #     addSkill(skill: Skill): Skill!
  #   }
`;

const resolvers = {
  Query: {
    techs: (
      _: any,
      args: any,
      context: { dataSources: { techApi: TechDataSource } },
      info: any
    ) => {
      console.log("[ARGS]", args);
      console.log("[INFO]", info);
      console.log("[CONTEXT]", dataSources);
      return context.dataSources.techApi.getAllTech();
    },
    tech: (
      _: any,
      args: any,
      context: { dataSources: { techApi: TechDataSource } }
    ) => {
      const { techId } = args;
      return context.dataSources.techApi.getById(techId);
    },
    skills: (
      _: any,
      args: any,
      context: { dataSources: { skillApi: SkillDataSource } },
      info: any
    ) => {
      console.log("[ARGS]", args);
      console.log("[INFO]", info);
      console.log("[CONTEXT]", dataSources);
      return context.dataSources.skillApi.getAllSkills();
    },
  },
  Skill: {
    async tech(
      parent: any,
      __: any,
      context: { dataSources: { techApi: TechDataSource } }
    ) {
      console.log('[Linking Tech to Skill]', parent)
      return await context.dataSources.techApi.getById(parent.id);
    },
  },
};

interface IDataSources {
  techApi: TechDataSource;
  skillApi: SkillDataSource;
}

const dataSources: DataSources<IDataSources> = {
  techApi: new TechDataSource(new TechDataContext()),
  skillApi: new SkillDataSource(new SkillDataContext()),
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
