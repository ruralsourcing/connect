import { IDataContext } from "../../data/types";
import { PrismaClient, Skill } from "@prisma/client";
const prisma = new PrismaClient();

export default class SkillDataContext implements IDataContext<Skill> {
    getAll(): Promise<Skill[]> {
        return prisma.skill.findMany({
            where: {
                User: {
                    id: 0
                }
            }
        });
    }
    get(id: string): Promise<Skill> {
        throw new Error("Method not implemented.");
    }
    post(item: Skill): Promise<Skill> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): void {
        throw new Error("Method not implemented.");
    }
    put(item: Skill): Promise<Skill> {
        throw new Error("Method not implemented.");
    }
    
}