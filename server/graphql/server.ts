import { ApolloServer, PubSub, gql, withFilter } from "apollo-server-express";
import TechDataSource from "./datasources/TechDataSource";
import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import TechDataContext from "../data/TechDataContext";
import SkillDataSource from "./datasources/SkillsDataSource";
import SkillDataContext from "../data/SkillDataContext";
import { User } from "@prisma/client";
import { AuthContext } from "../middleware/AuthContext";
import UserDataContext from "../data/UserDataContext";
import UserDataSource from "./datasources/UsersDataSource";

const pubsub = new PubSub();

const SKILL_ADDED = "SKILL_ADDED";
const SKILL_DELETED = "SKILL_DELETED";
const AFFIRMATION_GIVEN = "AFFIRMATION_GIVEN";

const typeDefs = gql`

  type Affirmation {
    from: ID!
    to: ID!
  }

  type User {
    id: ID!
    email: String
    domain: String
    skills: [Skill]
  }

  type Tech {
    id: ID!
    name: String
    description: String
    icon: String #base64 encoded images
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
    user: User
    users: [User]
  }

  type Mutation {
    addSkill(skill: SkillInput!): SkillWithTech!
    deleteSkill(skillId: ID!): Int
    sendAffirmation(userId: ID!): Affirmation
  }

  type Subscription {
    skillAdded: SkillWithTech
    skillDeleted: Int
    affirmationGiven: Affirmation
  }
`;

const resolvers = {
  Query: {
    technologies: (
      _: any,
      __: any,
      context: { dataSources: { techApi: TechDataSource } },
      ___: any
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
      __: any,
      context: { user: User; dataSources: { skillApi: SkillDataSource } },
      ___: any
    ) => {
      return context.dataSources.skillApi.getAllSkills();
    },
    skill: (
      _: any,
      args: any,
      context: { dataSources: { skillApi: SkillDataSource } },
      __: any
    ) => {
      const { skillId } = args;
      return context.dataSources.skillApi.getById(skillId);
    },
    user: (
      _: any,
      _args: any,
      context: { user: User; dataSources: { userApi: UserDataSource } },
      __: any
    ) => {
      if (!context.user)
        return {
          error:
            "There is no user context, did you forget to pass a bearer token?",
        };
      return context.dataSources.userApi.getById(context.user.id.toString());
    },
    users: (
      _: any,
      _args: any,
      context: { user: User; dataSources: { userApi: UserDataSource } },
      __: any
    ) => {
      if (!context.user)
        return {
          error:
            "There is no user context, did you forget to pass a bearer token?",
        };
      return context.dataSources.userApi.getAll();
    },
  },
  User: {
    skills: async (
      _: any,
      args: any,
      context: { user: User; dataSources: { skillApi: SkillDataSource } },
      __: any
    ) => {
      return context.dataSources.skillApi.getSkillsForUser(context.user.id);
    },
  },
  Skill: {
    technology: async (
      parent: any,
      __: any,
      context: { dataSources: { techApi: TechDataSource } }
    ) => {
      return await context.dataSources.techApi.getById(parent.techId);
    },
  },
  Mutation: {
    addSkill: async (
      _: any,
      { skill }: any,
      context: { user: User; dataSources: { skillApi: SkillDataSource } }
    ) => {
      let response = await context.dataSources.skillApi.create(
        skill.technologyId,
        skill.rating,
        context.user.id
      );
      //console.log("[QUERY RESULT]", response);
      pubsub.publish(SKILL_ADDED, { skillAdded: response, user: context.user });
      return response;
    },
    deleteSkill: async (
      _: any,
      { skillId }: any,
      context: { user: User; dataSources: { skillApi: SkillDataSource } }
    ) => {
      await context.dataSources.skillApi.delete(skillId);
      pubsub.publish(SKILL_DELETED, {
        skillDeleted: skillId,
        user: context.user,
      });
      return skillId;
    },
    sendAffirmation: async (
      _: any,
      { userId }: any,
      context: { user: User; dataSources: { skillApi: SkillDataSource } }
    ) => {
      const affirmation = {
        from: context.user.id,
        to: userId
      };
      pubsub.publish(AFFIRMATION_GIVEN, affirmation);
      return affirmation;
    }
  },
  Subscription: {
    skillAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("SKILL_ADDED"),
        (payload, _, context) => {
          return payload.user.id === context.user?.id;
        }
      ),
    },
    skillDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("SKILL_DELETED"),
        (payload, _, context) => {
          return payload.user.id === context.user?.id;
        }
      ),
    },
    affirmationGiven: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("AFFIRMATION_GIVEN"),
        (payload, _, context) => {
          return parseInt(payload.to) === context.user.id;
        }
      )
    }
  },
};

interface IDataSources {
  techApi: TechDataSource;
  skillApi: SkillDataSource;
  userApi: UserDataSource;
}

const dataSources: DataSources<IDataSources> = {
  techApi: new TechDataSource(new TechDataContext()),
  skillApi: new SkillDataSource(new SkillDataContext()),
  userApi: new UserDataSource(new UserDataContext()),
};

const dataContext = new UserDataContext();
const context = new AuthContext(dataContext);
export default new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => dataSources,
  introspection: true,
  // playground: true,
  context: async ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      // get the user token from the headers
      const token = req?.headers?.authorization?.split(" ")[1];
      let user;
      if (token) {
        try {
          //console.info("[ACCESS TOKEN]", token)
          const decoded = await context.decode(token);
          //console.log("[TOKEN INFO]", decoded, token);
          user = await context.getUser(decoded);
          //console.log('[USER CONTEXT]', user)
        } catch (ex) {
          console.error("[X0001]", ex.message);
        }
      }

      // optionally block the user
      // we could also check user roles/permissions here
      //if (!user) throw new AuthenticationError("you must be logged in");

      // add the user to the context
      return { user };
    }
  },
  subscriptions: {
    onConnect: async (connectionParams: any, webSocket) => {
      let user;
      try {
        if (connectionParams.authToken !== "") {
          const decoded = await context.decode(connectionParams.authToken);
          user = await context.getUser(decoded);
          return {
            user: user,
          };
        }
      } catch (ex) {
        console.error(ex);
      }
      return {
        currentUser: null,
      };
    },
  },
});
