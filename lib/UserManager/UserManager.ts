import { IDataContext } from "../../data/types";
import { User } from "./User";

export default class UserManager {
  private _context: IDataContext<User>;

  constructor(context: IDataContext<User>) {
    this._context = context;
  }

  async getAll(): Promise<User[]> {
    return await this._context.getAll();
  }

  async addUser(user: User): Promise<User> {
    return await this._context.post(user);
  }

  async delete(): Promise<void> {
    const users = await this.getAll();
    users.forEach(async u => {
        await this._context.delete(u.id);
    })
  }

  async getUser(id: string): Promise<User> {
    return await this._context.get(id);
  }
}