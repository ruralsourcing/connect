import { PrismaClient, User } from "@prisma/client";
import { Router } from "express";

export default class UserController {
  private path: string = "/users";
  private router: Router;
  private client: PrismaClient;
  constructor(router: Router) {
    this.router = router;
    this.client = new PrismaClient();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.getAllUsers);
  };

  private getAllUsers = async (req: any, res: { json: (arg0: User[]) => void; sendStatus: (arg0: number) => void; send: (arg0: any) => void; }) => {
    let users: User[];
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
  };
}
