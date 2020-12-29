import { Application } from "express";
import SkillDataContext from "../lib/SkillsManager/SkillDataContext";
import SkillManager from "../lib/SkillsManager/SkillManager";
import { authCheck } from "../middleware/AuthMiddleware";

export default class SkillController {
  private app: Application;
  private manager: SkillManager;
  constructor(app: Application) {
    this.app = app;
    this.manager = new SkillManager(new SkillDataContext());
  }

  routes() {
    this.app.get(
      "/api/skills",
      authCheck,
      async (req, res) => res.json(await this.manager.getAll())
    );
  }
}
