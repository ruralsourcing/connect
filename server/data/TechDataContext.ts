import { IDataContext } from "./types";
import { Prisma, PrismaClient, Tech } from "@prisma/client";

export interface ITechDataContext
  extends IDataContext<Tech, Prisma.TechCreateInput> {}

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

  get(id: string): Promise<Tech> {
    throw new Error("Method not implemented.");
  }
  post(data: Prisma.TechCreateInput): Promise<Tech> {
    return this.client.tech.create({
      data,
    });
  }
  delete(id: string): void {
    throw new Error("Method not implemented.");
  }
  put(item: Tech): Promise<Tech> {
    throw new Error("Method not implemented.");
  }
}
