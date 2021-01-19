import { User } from "@prisma/client";
import { gql, IResolvers, PubSub, withFilter } from "apollo-server-express";
import SkillDataSource from "../datasources/SkillsDataSource";

const AFFIRMATION_GIVEN = "AFFIRMATION_GIVEN";

export const AffirmationsTypeDefs = gql`
  type Affirmation {
    from: ID!
    to: ID!
  }

  extend type Mutation {
    sendAffirmation(userId: ID!): Affirmation
  }

  extend type Subscription {
    affirmationGiven: Affirmation
  }
`;

export default class AffirmationsResolvers {
  resolvers: IResolvers;
  pubsub: PubSub;

  constructor(pubsub: PubSub) {
    this.resolvers = this.initializeResolvers();
    this.pubsub = pubsub;
  }

  initializeResolvers = (): IResolvers => {
    return {
      Mutation: {
        sendAffirmation: async (
          _: any,
          { userId }: any,
          context: { user: User; dataSources: { skillApi: SkillDataSource } }
        ) => {
          const affirmation = {
            from: context.user.id,
            to: userId,
          };
          this.pubsub.publish(AFFIRMATION_GIVEN, affirmation);
          return affirmation;
        },
      },
      Subscription: {
        affirmationGiven: {
          subscribe: withFilter(
            () => this.pubsub.asyncIterator("AFFIRMATION_GIVEN"),
            (payload, _, context) => {
              return parseInt(payload.to) === context.user.id;
            }
          ),
        },
      },
    };
  };
}
