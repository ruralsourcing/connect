import { Repo } from "../Repo";
import {
  MeetingDataModel,
  MeetingAttributes,
  MeetingCreationAttributes,
} from "./MeetingDataModel";

export interface IMeetingRepo extends Repo<MeetingAttributes> {
  addMeeting(user: MeetingCreationAttributes, userId: number): Promise<MeetingAttributes>;
  getMeetingByUuid(uuid: string): Promise<MeetingAttributes | null>;
}

export class MeetingRepo implements IMeetingRepo {
  getMeetingByUuid(uuid: string): Promise<MeetingAttributes | null> {
      return MeetingDataModel.findOne({
          where: {
              uuid: uuid
          }
      })
  }
  async addMeeting(meeting: MeetingCreationAttributes, userId: number): Promise<MeetingAttributes> {
    console.log("MEETING:", meeting)
    const m = await MeetingDataModel.create(meeting);
    console.log(m);
    m.setDataValue('userId', userId);
    await m.save();
    return m;
  }
  exists(t: MeetingAttributes): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(t: MeetingAttributes): Promise<any> {
    throw new Error("Method not implemented.");
  }
  save(t: MeetingAttributes): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
