import { Meeting, Prisma } from "@prisma/client";
import { IDataContext } from "../../data/types";

export default class MeetingManager {
  private _context: IDataContext<Meeting, Prisma.MeetingCreateInput>;

  constructor(context: IDataContext<Meeting, Prisma.MeetingCreateInput>) {
    this._context = context;
  }

  async getAll(): Promise<Meeting[]> {
    return await this._context.getAll();
  }

  async addMeeting(meeting: Prisma.MeetingCreateInput) {
    await this._context.post(meeting);
  }

  async getMeeting(uuid: string): Promise<Meeting | null> {
    return await this._context.get(uuid);
  }
}
