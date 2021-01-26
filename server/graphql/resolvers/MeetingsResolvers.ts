import { User } from "@prisma/client";
import { gql, IResolvers, PubSub, withFilter } from "apollo-server-express";
import ZoomDataSource from "../datasources/ZoomDataSource";
import jwt_decode from "jwt-decode";
import axios from "axios";

export const MEETING_STARTED = "MEETING_STARTED";

export const MeetingsTypeDefs = gql`
  type Meeting {
    id: Int
    uuid: String
    host_id: String
    host_email: String
    topic: String
    start_url: String
    join_url: String
    password: String
    userId: String
  }

  extend type Mutation {
    startMeeting(users: [ID!]): Meeting
  }

  extend type Subscription {
    meetingStarted: Meeting
  }
`;

export default class MeetingsResolvers {
  resolvers: IResolvers;
  pubsub: PubSub;

  constructor(pubsub: PubSub) {
    this.resolvers = this.initializeResolvers();
    this.pubsub = pubsub;
  }

  initializeResolvers = (): IResolvers => {
    return {
      Mutation: {
        startMeeting: async (
          _: any,
          __: any,
          context: { user: User; dataSources: { zoomApi: ZoomDataSource } }
        ) => {
          let accessToken = await context.dataSources.zoomApi.getForUser(
            context.user.id
          );
          if (!accessToken) return;
          let token = jwt_decode<any>(accessToken.token);
          console.log("[START MEETING TOKEN]", token);
          let response = await axios.post(
            `https://api.zoom.us/v2/users/${token.uid}/meetings`,
            {
              type: 1,
              topic: "CASpR Support",
              agenda: "Understanding the reducer pattern in React",
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken.token}`,
              },
            }
          );
          console.log("[MEETING CREATED]", response.data);
          return response.data;
        },
      },
      Subscription: {
        meetingStarted: {
          subscribe: withFilter(
            () => this.pubsub.asyncIterator("MEETING_STARTED"),
            (payload, _, context) => {
              console.log("[MEETING STARTED]", payload, context);
              return true;
              //return parseInt(payload.to) === context.user.id;
            }
          ),
        },
      },
    };
  };
}
