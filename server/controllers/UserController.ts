import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import { authCheck } from "../middleware/AuthMiddleware";

export default class UserController {
  private app: Application;
  private client: PrismaClient;
  constructor(app: Application) {
    this.app = app;
    this.client = new PrismaClient();
  }

  routes() {
    this.app.get("/users", authCheck, async (req, res) => {
      let users;
      try {
        users = await this.client.user.findMany({
          take: 10,
          include: {
            Profile: true,
            ZoomAuth: true,
          },
        });
        if (users) res.json(users);
        else res.sendStatus(200);
      } catch (ex) {
        console.log(ex);
        res.send(ex);
      }
    });
  }
}
