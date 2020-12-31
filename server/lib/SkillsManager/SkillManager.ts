import { Skill, Prisma } from "@prisma/client";
import { IDataContext } from "../../data/types";

export default class SkillManager {
    private _context: IDataContext<Skill, Prisma.SkillCreateInput>;

    constructor(context: IDataContext<Skill, Prisma.SkillCreateInput>){
        this._context = context;
    }

    async getAll(): Promise<Skill[]> {
        return await this._context.getAll();
    }
}