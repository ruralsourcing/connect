import { User } from "@prisma/client";
import UserDataContext, {
    IUserDataContext,
} from "../../data/UserDataContext";
import { DataSource } from "apollo-datasource";

export default class UserDataSource extends DataSource {
  private context: IUserDataContext;
  constructor(context: IUserDataContext) {
    super();
    this.context = new UserDataContext();
  }

  getById = async (id: string): Promise<User | null> => {
    return await this.context.get(id);
  };

  getAllSkills = async (userId: number): Promise<User[]> => {
    return await this.context.getAll();
  };
}
