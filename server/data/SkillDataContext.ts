import { IDataContext } from "./types";
import { Prisma, PrismaClient, Skill } from "@prisma/client";
const prisma = new PrismaClient();

export interface ISkillDataContext extends IDataContext<Skill, Prisma.SkillCreateInput> {}

export default class SkillDataContext implements ISkillDataContext {
    getAll(): Promise<Skill[]> {
        return prisma.skill.findMany();
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