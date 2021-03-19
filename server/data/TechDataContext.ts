import { IDataContext } from "./types";
import { PrismaClient, Tech } from "@prisma/client";

export interface ITechDataContext
  extends IDataContext<Tech> {}

export default class TechDataContext implements ITechDataContext {
  client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }
  getAll(): Promise<Tech[]> {
    return this.client.tech.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  get(id: string): Promise<Tech | null> {
    return this.client.tech.findFirst({
      where: {
        id: parseInt(id)
      }
    })
  }
  post(data: Tech): Promise<Tech> {
    return this.client.tech.create({
      data: {
        name: data.name
      }
    });
  }
  delete(id: string): Promise<Tech> {
    throw new Error("Method not implemented.");
  }
  put(item: Tech): Promise<Tech> {
    throw new Error("Method not implemented.");
  }
}
