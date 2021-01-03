import { Skill, User } from "@prisma/client";
import { Router } from "express";
import { ISkillDataContext, SkillInput } from "../data/SkillDataContext";
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
    this.router
      .get(this.path, this.getAllSkills)
      .get(`/user${this.path}`, UserContext, this.getSkillsForUser)
      .post(`/user${this.path}`, UserContext, this.createSkillForUser);
  };

  createSkillForUser = async (
    req: {
      body: SkillInput;
    },
    res: { locals: any; json: (skill: Skill) => void }
  ) => {
    const user = res.locals.user;
    res.json(await this.context.createSkillForUser(req.body, user.id));
  };

  private getAllSkills = async (
    req: any,
    res: { json: (skills: Skill[]) => void }
  ) => {
    res.json(await this.context.getAll());
  };

  private getSkillsForUser = async (
    req: any,
    res: { locals: any; json: (skills: Skill[]) => void }
  ) => {
    const user = res.locals.user as User;
    res.json(await this.context.getSkillsForUser(user.id));
  };
}
