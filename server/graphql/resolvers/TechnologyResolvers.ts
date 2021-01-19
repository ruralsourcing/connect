import { gql, IResolvers } from "apollo-server-express";
import TechDataSource from "../datasources/TechDataSource";

export const TechnologyTypeDefs = gql`
  type Tech {
    id: ID!
    name: String
    description: String
    icon: String
  }

  extend type Query {
    technologies: [Tech]!
    technology(technologyId: ID!): Tech
  }
`;

export default class TechnologyResolvers {
  resolvers: IResolvers;

  constructor() {
    this.resolvers = this.initializeResolvers();
  }

  initializeResolvers = (): IResolvers => {
    return {
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
      },
    };
  };
}
