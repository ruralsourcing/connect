import { Skill, User } from "@prisma/client";
import { Router } from "express";
import { ISkillDataContext } from "../data/SkillDataContext";
import { UserContext } from "../middleware/UserContext";

export default class SkillController {
  private path: string = "/skills";
  private router: Router;
  private context: ISkillDataContext;
  constructor(router: Router, context: ISkillDataContext) {
    this.router = router;
    this.context = context;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(this.path, this.getAllSkills);
    this.router.get(`/user${this.path}`, UserContext, this.getSkillsForUser)
  };

  private getAllSkills = async (req: any, res: { json: (arg0: Skill[]) => void; }) => {
    res.json(await this.context.getAll())
  }

  private getSkillsForUser = async (req: any, res: { locals: any, json: (skils: Skill[]) => void; }) => {
    const user = res.locals.user as User
    res.json(await this.context.getSkillsForUser(user.id))
  }
}
