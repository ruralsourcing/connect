import { Application } from "express";
import MeetingDataContext from "../lib/MeetingManager/MeetingDataContext";
import MeetingManager from "../lib/MeetingManager/MeetingManager";

export default class SkillController {
  private app: Application;
  private manager: MeetingManager;
  constructor(app: Application) {
    this.app = app;
    this.manager = new MeetingManager(new MeetingDataContext());
  }

  routes() {
    this.app.get("/meetings", async (_, res) => {
      res.json(await this.manager.getAll());
    });

    this.app.post("/meetings", async (req, res) => {
      await this.manager.addMeeting({
        userId: 0, // FIX THIS
        uuid: "JtcANK6eSaWGRSAgN8xg+Q==",
        id: 1,
        host_id: "eyxXfnupQvWNjXJcNoD7Xg",
        host_email: "david@federnet.com",
        topic: "CASpR Support",
        start_url:
          "https://zoom.us/s/93398173560?zak=eyJ6bV9za20iOiJ6bV9vMm0iLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQiLCJ1aWQiOiJleXhYZm51cFF2V05qWEpjTm9EN1hnIiwiaXNzIjoid2ViIiwic3R5IjoxLCJ3Y2QiOiJhdzEiLCJjbHQiOjAsInN0ayI6InQ5NUNKWG1rcHo0U0lkMV9aUndTOUduZElhdlNMRGtja3U5aFh2LVcwbUEuQUcuTTFxWFcxc3d0Zmw2TWFQR21hVHczWnU0V0I5Vmt3S1hoc3h5Uk1telplVFBaeXBZMk9lY0RzblpUclJqREMxWExubTJTeFk5djNHS0NwNC5KTGFBZWNkcjJIZ2N6TVFyMllvNE9BLk44bnJubEhSVlA0OFROTVQiLCJleHAiOjE2MDcyMDg0NzgsImlhdCI6MTYwNzIwMTI3OCwiYWlkIjoidV96UmVSbWhSWWlLY0U2dzdhQVpoZyIsImNpZCI6IiJ9.NXPpvZRL80AVFMVyqaXhKO1hKywkFbYyze48LtOxTWw",
        join_url:
          "https://zoom.us/j/93398173560?pwd=c2dnaFMzTzkvSmgzZnhaUVZYb2lwdz09",
        password: "u4UrGs",
      });
      res.sendStatus(200);
    });
  }
}
