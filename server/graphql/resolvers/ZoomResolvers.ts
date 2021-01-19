import { User } from "@prisma/client";
import { gql, IResolvers } from "apollo-server-express";
import axios from "axios";
import { ZoomCodeInput } from "../../data/ZoomDataContext";
import UserDataSource from "../datasources/UsersDataSource";
import ZoomDataSource from "../datasources/ZoomDataSource";

export const ZoomTypeDefs = gql`
  type ZoomAuth {
    id: ID!
    token: String
    userId: Int
  }

  input ZoomAuthInput {
    code: String
    state: String
  }

  extend type Mutation {
    addZoomAuth(zoomAuth: ZoomAuthInput): ZoomAuth!
  }
`;

export default class ZoomResolvers {
  resolvers: IResolvers;

  constructor() {
    this.resolvers = this.initializeResolvers();
  }

  initializeResolvers = (): IResolvers => {
    return {
      Mutation: {
        addZoomAuth: async (
          _: any,
          { zoomAuth }: { zoomAuth: ZoomCodeInput },
          context: { user: User; dataSources: { zoomApi: ZoomDataSource } }
        ) => {
          console.log("[CODE AND STATE]", zoomAuth);
          const { code, state } = zoomAuth;
          return await context.dataSources.zoomApi.create({
            code,
            userId: context.user.id,
            state,
          });
        },
      },
    };
  };
}
