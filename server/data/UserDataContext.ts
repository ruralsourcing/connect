import { IDataContext } from "./types";
import { PrismaClient, User, Prisma } from "@prisma/client";

export interface IUserDataContext extends IDataContext<User, Prisma.UserCreateInput> {
  getByEmail(email: string): Promise<User | null>;
}

export default class UserDataContext implements IUserDataContext {

  client: PrismaClient;

  constructor(){
    this.client = new PrismaClient();
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.client.user.findUnique({
      where: {
        email: email
      }
    })
  }
  async getAll(): Promise<User[]> {
    return await this.client.user.findMany();
  }
  async get(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  async post(item: Prisma.UserCreateInput): Promise<User> {
    return await this.client.user.create({
      data: item
    })
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async put(item: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
