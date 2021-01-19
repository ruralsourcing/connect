import { User } from "@prisma/client";
import { gql, IResolvers } from "apollo-server-express";
import SkillDataSource from "../datasources/SkillsDataSource";
import TechDataSource from "../datasources/TechDataSource";
import UserDataSource from "../datasources/UsersDataSource";

export const UsersTypeDefs = gql`
  type User {
    id: ID!
    email: String
    domain: String
    skills: [Skill]
    zoom: ZoomAuth
  }

  extend type Query {
    user: User
    users: [User]
  }
`;

export default class UsersResolvers {
  resolvers: IResolvers;

  constructor() {
    this.resolvers = this.initializeResolvers();
  }

  initializeResolvers = (): IResolvers => {
    return {
      Query: {
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
          return context.dataSources.userApi.getById(
            context.user.id.toString()
          );
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
        zoom: async (
          _: any,
          args: any,
          context: { user: User; dataSources: { userApi: UserDataSource } }
        ) => {
          return context.dataSources.userApi.getZoomAuth(context.user.id);
        },
      },
    };
  };
}
