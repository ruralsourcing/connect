import { Meeting } from "@prisma/client";
import { IDataContext } from "../../data/types";

export default class MeetingManager {
  private _context: IDataContext<Meeting>;

  constructor(context: IDataContext<Meeting>) {
    this._context = context;
  }

  async getAll(): Promise<Meeting[]> {
    return await this._context.getAll();
  }

  async addMeeting(meeting: Meeting) {
    await this._context.post(meeting);
  }

  async getMeeting(uuid: string): Promise<Meeting | null> {
    return await this._context.get(uuid);
  }
}
