import { IDataContext } from "./types";
import { Prisma, PrismaClient, Skill } from "@prisma/client";

export interface ISkillDataContext
  extends IDataContext<Skill, Prisma.SkillCreateInput> {
  getSkillsForUser(userId: number): Promise<Skill[]>;
}

class TSkillDataContext implements ISkillDataContext {
  getSkillsForUser(userId: number): Promise<Skill[]> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<Skill[]> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<Skill | null> {
    throw new Error("Method not implemented.");
  }
  post(item: Prisma.SkillCreateInput): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): void {
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
    return this.client.skill.findMany({
      where: {
        userId,
      },
    });
  }

  get(id: string): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
  post(item: Prisma.SkillCreateInput): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): void {
    throw new Error("Method not implemented.");
  }
  put(item: Skill): Promise<Skill> {
    throw new Error("Method not implemented.");
  }
}
