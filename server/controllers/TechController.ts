import { Tech } from "@prisma/client";
import { Router } from "express";
import { ITechDataContext } from "../data/TechDataContext";

export default class SkillController {
  private path: string = "/tech";
  private router: Router;
  private context: ITechDataContext;
  constructor(router: Router, context: ITechDataContext) {
    this.router = router;
    this.context = context;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router
      .get(`${this.path}`, this.getAllTech)
      .post(`${this.path}`, this.createTech);
  };

  private getAllTech = async (
    _: any,
    res: { json: (tech: Tech[]) => void }
  ) => {
    res.json(await this.context.getAll());
  };

  private createTech = async (
    req: { body: Tech },
    res: { json: (tech: Tech) => void }
  ) => {
    res.json(await this.context.post(req.body));
  };
}
