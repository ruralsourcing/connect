import { IDataContext } from "../../data/types";
import { Meeting } from "./Meeting";

export default class MeetingManager {
  private _meetings: Meeting[];
  private _context: IDataContext<Meeting>;

  constructor(context: IDataContext<Meeting>) {
    this._meetings = [];
    this._context = context;
  }

  async getAll(): Promise<Meeting[]> {
    return await this._context.getAll();
  }

  async addMeeting(meeting: Meeting) {
    //this._meetings.push(meeting);
    await this._context.post(meeting);
  }

  async getMeeting(uuid: string): Promise<Meeting> {
    // let meeting = null;
    // meeting = this._meetings.find((m) => m.uuid === uuid);
    // if (!meeting) throw "Something went wrong";
    return await this._context.get(uuid);
  }
}
