import { Skill } from "@prisma/client";
import { Router } from "express";
import SkillDataContext from "../lib/SkillsManager/SkillDataContext";
import SkillManager from "../lib/SkillsManager/SkillManager";

export default class SkillController {
  private path: string = "/skills";
  private router: Router;
  private manager: SkillManager;
  constructor(router: Router) {
    this.router = router;
    this.manager = new SkillManager(new SkillDataContext());
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.getAllSkills);
  };

  private getAllSkills = async (req: any, res: { json: (arg0: Skill[]) => void; }) => {
    res.json(await this.manager.getAll())
  }
}
