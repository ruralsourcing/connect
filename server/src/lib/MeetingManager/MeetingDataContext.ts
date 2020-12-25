import { Meeting } from "./Meeting";
import { IDataContext } from "../../data/types";

import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
export default class MeetingDataContext implements IDataContext<Meeting> {
  async getAll(): Promise<Meeting[]> {
    return prisma.meeting.findMany();
  }
  async get(uuid: string): Promise<Meeting | null> {
    return await prisma.meeting.findUnique({
      where: {
        uuid: uuid,
      },
    });
  }
  async post(item: Meeting): Promise<Meeting> {
    return await prisma.meeting.create({
      data: item,
    });
  }
  async delete(id: string): Promise<Meeting> {
    return await prisma.meeting.delete({ where: { id: parseInt(id) } });
  }
  async put(item: Meeting): Promise<Meeting> {
    return prisma.meeting.update({
      where: {
        id: item.id
      },
      data: item
    })
  }
}
