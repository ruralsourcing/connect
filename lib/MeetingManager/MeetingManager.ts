import { IDataContext } from "../../data/types";
import { Meeting } from "./Meeting";

export default class MeetingManager {
  _meetings: Meeting[];
  _context: IDataContext<Meeting>;

  constructor(context: IDataContext<Meeting>) {
    this._meetings = [];
    this._context = context;
  }

  async getAll(): Promise<Meeting[]> {
    return await this._context.getAll();
  }

  addMeeting(meeting: Meeting) {
    this._meetings.push(meeting);
    //this._context.post(meeting);
  }

  getMeeting(uuid: string): Meeting {
    let meeting = null;
    meeting = this._meetings.find((m) => m.uuid === uuid);
    if (!meeting) throw "Something went wrong";
    return meeting;
  }
}
