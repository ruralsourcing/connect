import { IDataContext } from "./types";
import { PrismaClient, Meeting, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export interface IMeetingDataContext extends IDataContext<Meeting, Prisma.MeetingCreateInput> {

}

export default class MeetingDataContext implements IMeetingDataContext {
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
  async post(item: Prisma.MeetingCreateInput): Promise<Meeting> {
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
