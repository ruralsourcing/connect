import { Meeting } from "@prisma/client";
import { Router } from "express";
import { IMeetingDataContext } from "../data/MeetingDataContext";

export default class MeetingController {
  private path: string = "/meetings";
  public router: Router;
  private context: IMeetingDataContext;
  constructor(router: Router, context: IMeetingDataContext) {
    this.router = router;
    this.context = context;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllMeetings);
    this.router.post(this.path, this.createMeeting);
  }

  private getAllMeetings = async (
    _: any,
    res: { json: (arg0: Meeting[]) => void }
  ) => {
    res.json(await this.context.getAll());
  };

  private createMeeting = async (
    _: any,
    res: { locals: any; sendStatus: (status: number) => void }
  ) => {
    const user = res.locals.user;
    await this.context.createMeetingForUser(
      {
        uuid: "JtcANK6eSaWGRSAgN8xg+Q==",
        host_id: "eyxXfnupQvWNjXJcNoD7Xg",
        host_email: "david@federnet.com",
        topic: "CASpR Support",
        start_url:
          "https://zoom.us/s/93398173560?zak=eyJ6bV9za20iOiJ6bV9vMm0iLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQiLCJ1aWQiOiJleXhYZm51cFF2V05qWEpjTm9EN1hnIiwiaXNzIjoid2ViIiwic3R5IjoxLCJ3Y2QiOiJhdzEiLCJjbHQiOjAsInN0ayI6InQ5NUNKWG1rcHo0U0lkMV9aUndTOUduZElhdlNMRGtja3U5aFh2LVcwbUEuQUcuTTFxWFcxc3d0Zmw2TWFQR21hVHczWnU0V0I5Vmt3S1hoc3h5Uk1telplVFBaeXBZMk9lY0RzblpUclJqREMxWExubTJTeFk5djNHS0NwNC5KTGFBZWNkcjJIZ2N6TVFyMllvNE9BLk44bnJubEhSVlA0OFROTVQiLCJleHAiOjE2MDcyMDg0NzgsImlhdCI6MTYwNzIwMTI3OCwiYWlkIjoidV96UmVSbWhSWWlLY0U2dzdhQVpoZyIsImNpZCI6IiJ9.NXPpvZRL80AVFMVyqaXhKO1hKywkFbYyze48LtOxTWw",
        join_url:
          "https://zoom.us/j/93398173560?pwd=c2dnaFMzTzkvSmgzZnhaUVZYb2lwdz09",
        password: "u4UrGs",
      },
      user.id
    );
    res.sendStatus(200);
  };
}
