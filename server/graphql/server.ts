import {
  ApolloServer,
  AuthenticationError,
  PubSub,
  gql,
} from "apollo-server-express";
import TechDataSource from "./datasources/TechDataSource";
import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import TechDataContext from "../data/TechDataContext";
import SkillDataSource from "./datasources/SkillsDataSource";
import SkillDataContext, { SkillInput } from "../data/SkillDataContext";
import { User } from "@prisma/client";

const pubsub = new PubSub();

const SKILL_ADDED = "SKILL_ADDED";

const typeDefs = gql`
  type Tech {
    id: ID!
    name: String
  }
  type Skill {
    id: ID!
    technology: Tech!
    rating: Int
  }

  type SkillWithTech {
    id: ID!
    userId: ID!
    rating: Int!
    Tech: Tech!
  }

  input SkillInput {
    technologyId: Int
    rating: Int
  }

  type Query {
    technologies: [Tech]!
    technology(technologyId: ID!): Tech
    skills: [Skill]
    skill(skillId: ID!): Skill
  }

  type Mutation {
    addSkill(skill: SkillInput!): SkillWithTech!
  }

  type Subscription {
    skillAdded: SkillWithTech
  }
`;

const resolvers = {
  Query: {
    technologies: (
      _: any,
      args: any,
      context: { dataSources: { techApi: TechDataSource } },
      info: any
    ) => {
      return context.dataSources.techApi.getAllTech();
    },
    technology: (
      _: any,
      args: any,
      context: { dataSources: { techApi: TechDataSource } }
    ) => {
      console.log("[ARGS]", args);
      const { technologyId } = args;
      return context.dataSources.techApi.getById(technologyId);
    },
    skills: (
      _: any,
      args: any,
      context: { user: User; dataSources: { skillApi: SkillDataSource } },
      info: any
    ) => {
      return context.dataSources.skillApi.getAllSkills(context.user.id);
    },
    skill: (
      _: any,
      args: any,
      context: { dataSources: { skillApi: SkillDataSource } },
      info: any
    ) => {
      const { skillId } = args;
      return context.dataSources.skillApi.getById(skillId);
    },
  },
  Skill: {
    technology: async (
      parent: any,
      __: any,
      context: { dataSources: { techApi: TechDataSource } }
    ) => {
      console.log("[Linking Tech to Skill]", parent);
      return await context.dataSources.techApi.getById(parent.techId);
    },
  },
  Mutation: {
    addSkill: async (
      _: any,
      { skill }: any,
      context: { user: User; dataSources: { skillApi: SkillDataSource } }
    ) => {
      console.log(skill, context);
      console.log("[USER]", context.user);
      let response = await context.dataSources.skillApi.create(
        skill.technologyId,
        skill.rating,
        context.user.id
      );
      console.log("[QUERY RESULT]", response);
      pubsub.publish(SKILL_ADDED, { skillAdded: response });
      return response;
    },
  },
  Subscription: {
    skillAdded: {
      subscribe: () => pubsub.asyncIterator([SKILL_ADDED]),
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
  context: ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      // get the user token from the headers
      const token = req?.headers?.authorization;
      // try to retrieve a user with the token
      const user = {
        id: 1,
        email: "david@federnet.com",
        domain: null,
      } as User;

      // optionally block the user
      // we could also check user roles/permissions here
      if (!user) throw new AuthenticationError("you must be logged in");

      // add the user to the context
      return { user };
    }
  },
});
