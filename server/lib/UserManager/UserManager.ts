import { Prisma, User } from "@prisma/client";
import { IUserDataContext } from "./UserDataContext";

export interface IUserManager {
  create(user: Prisma.UserCreateInput): Promise<User>;
  getAll(): Promise<User[]>;
  getByEmail(email: string): Promise<User | null>;
}

export default class UserManager implements IUserManager {
  private _context: IUserDataContext;

  constructor(context: IUserDataContext) {
    this._context = context;
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this._context.getByEmail(email);
  }

  async getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async create(user: User): Promise<User> {
    return await this._context.post(user);
  }

  async delete(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getUser(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
}
