import { ZoomAuth } from "@prisma/client";
import { DataSource } from "apollo-datasource";
import { IZoomDataContext, ZoomCodeInput } from "../../data/ZoomDataContext";

export default class ZoomDataSource extends DataSource {
  private context: IZoomDataContext;
  constructor(context: IZoomDataContext) {
    super();
    this.context = context;
  }

  getAll = async (): Promise<ZoomAuth[]> => {
      const users = await this.context.getAll();
      console.log("[USERS]", users);
      return users;
  }

  getById = async (id: string): Promise<ZoomAuth | null> => {
    return await this.context.get(id);
  };

  getForUser = async (userId: number): Promise<ZoomAuth | null> => {
    return await this.context.getForUser(userId);
  };

  create = async (auth: ZoomCodeInput): Promise<ZoomAuth | null> => {
      return await this.context.addToken(auth);
  }
  
}
