import { User } from "@prisma/client";
import { gql, IResolvers, PubSub, withFilter } from "apollo-server-express";
import SkillDataSource from "../datasources/SkillsDataSource";
import TechDataSource from "../datasources/TechDataSource";

const SKILL_ADDED = "SKILL_ADDED";
const SKILL_DELETED = "SKILL_DELETED";

export const SkillsTypeDefs = gql`
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

  extend type Query {
    skills: [Skill]
    skill(skillId: ID!): Skill
  }

  extend type Mutation {
    addSkill(skill: SkillInput!): SkillWithTech!
    deleteSkill(skillId: ID!): Int
  }

  extend type Subscription {
    skillAdded: SkillWithTech
    skillDeleted: Int
  }
`;

export default class SkillsResolvers {
  resolvers: IResolvers;
  pubsub: PubSub;

  constructor(pubsub: PubSub) {
    this.resolvers = this.initializeResolvers();
    this.pubsub = pubsub;
  }

  initializeResolvers = (): IResolvers => {
    return {
      Query: {
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
          this.pubsub.publish(SKILL_ADDED, {
            skillAdded: response,
            user: context.user,
          });
          return response;
        },
        deleteSkill: async (
          _: any,
          { skillId }: any,
          context: { user: User; dataSources: { skillApi: SkillDataSource } }
        ) => {
          await context.dataSources.skillApi.delete(skillId);
          this.pubsub.publish(SKILL_DELETED, {
            skillDeleted: skillId,
            user: context.user,
          });
          return skillId;
        },
      },
      Subscription: {
        skillAdded: {
          subscribe: withFilter(
            () => this.pubsub.asyncIterator("SKILL_ADDED"),
            (payload, _, context) => {
              return payload.user.id === context.user?.id;
            }
          ),
        },
        skillDeleted: {
          subscribe: withFilter(
            () => this.pubsub.asyncIterator("SKILL_DELETED"),
            (payload, _, context) => {
              return payload.user.id === context.user?.id;
            }
          ),
        },
      },
    };
  };
}
