import { Meeting } from "./Meeting";

export default class MeetingManager {
  _meetings: Meeting[];

  constructor() {
    this._meetings = [];
  }

  addMeeting(meeting: Meeting) {
    this._meetings.push(meeting);
  }

  getMeeting(uuid: string): Meeting {
    let meeting = null;
    meeting = this._meetings.find((m) => m.uuid === uuid);
    if (!meeting) throw "Something went wrong";
    return meeting;
  }
}
