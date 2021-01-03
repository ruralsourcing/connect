import { IDataContext } from "./types";
import { PrismaClient, Meeting } from "@prisma/client";
const prisma = new PrismaClient();

export interface MeetingInput {
  uuid: string
  host_id: string
  host_email: string
  topic: string
  start_url: string
  join_url: string
  password: string
}

export interface IMeetingDataContext extends IDataContext<Meeting> {
  createMeetingForUser(meeting: MeetingInput, userId: number): Promise<Meeting>;
}

export default class MeetingDataContext implements IMeetingDataContext {
  createMeetingForUser = async (meeting: MeetingInput, userId: number): Promise<Meeting> => {
    return await prisma.meeting.create({
      data: {
        ...meeting,
        User: {
          connect: {
            id: userId
          }
        }
      }
    });
  }
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
