import { Skill } from "@prisma/client";
import { IDataContext } from "../../data/types";

export default class SkillManager {
    private _context: IDataContext<Skill>;

    constructor(context: IDataContext<Skill>){
        this._context = context;
    }

    async getAll(): Promise<Skill[]> {
        return await this._context.getAll();
    }
}