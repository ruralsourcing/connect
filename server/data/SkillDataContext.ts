import { IDataContext } from "./types";
import { PrismaClient, Skill } from "@prisma/client";
import { analytics } from "googleapis/build/src/apis/analytics";

export interface ISkillDataContext extends IDataContext<Skill> {
  getSkillsForUser(userId: number): Promise<Skill[]>;
  createSkillForUser(skill: SkillInput, userId: number): Promise<Skill>;
}

export interface SkillInput {
  technologyId: number;
  rating: number;
}

class TSkillDataContext implements ISkillDataContext {
  getSkillsForUser(userId: number): Promise<Skill[]> {
    throw new Error("Method not implemented.");
  }
  createSkillForUser(skill: SkillInput, userId: number): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<Skill[]> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<Skill | null> {
    throw new Error("Method not implemented.");
  }
  post(item: Skill): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
  put(item: Skill): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
}

export default class SkillDataContext implements ISkillDataContext {
  client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }
  getAll(): Promise<Skill[]> {
    return this.client.skill.findMany();
  }

  getSkillsForUser(userId: number): Promise<Skill[]> {
    console.info("[GET SKILLS FOR USER]", userId);
    return this.client.skill.findMany({
      where: {
        userId,
      },
    });
  }

  createSkillForUser(skill: SkillInput, userId: number): Promise<Skill> {
    console.log("[CREATE SKILL]", skill, userId);
    return this.client.skill.create({
      data: {
        rating: skill.rating,
        Tech: {
          connect: {
            id: skill.technologyId,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        Tech: true,
      },
    });
  }

  get(id: string): Promise<Skill | null> {
    return this.client.skill.findFirst({
      where: {
        id: parseInt(id),
      },
    });
  }
  post(item: Skill): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Skill> {
    console.log("DELETE")
    return this.client.skill.delete({
      where: { id: parseInt(id) },
    });
  }
  put(item: Skill): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
}
