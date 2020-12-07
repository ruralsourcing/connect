import MeetingManager from "../MeetingManager";
import MeetingContext from "../../../data/MeetingContext";
import { Meeting } from "../Meeting";

const data = require("../../../data/db.json");

class TestableMeetingContext implements MeetingContext {
  getAll(): Promise<Meeting[]> {
    return new Promise<Meeting[]>((resolve, reject) => {
      resolve([
        {
          uuid: "123",
          start_url: "the place to be",
          topic: "interesting thing",
        } as Meeting,
      ]);
    });
  }
  get(uuid: string): Promise<Meeting> {
    return new Promise<Meeting>((resolve, reject) => {
      resolve({
        uuid: uuid,
        start_url: "the place to be",
        topic: "interesting thing",
      } as Meeting);
    });
  }
  post(item: Meeting): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  put(item: Meeting): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

const context = new TestableMeetingContext();
const manager = new MeetingManager(context);

test("can add meetings from zoom payload", async () => {
  manager.addMeeting({
    uuid: "JtcANK6eSaWGRSAgN8xg+Q==",
    id: 93398173560,
    host_id: "eyxXfnupQvWNjXJcNoD7Xg",
    host_email: "david@federnet.com",
    topic: "CASpR Support",
    start_url:
      "https://zoom.us/s/93398173560?zak=eyJ6bV9za20iOiJ6bV9vMm0iLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQiLCJ1aWQiOiJleXhYZm51cFF2V05qWEpjTm9EN1hnIiwiaXNzIjoid2ViIiwic3R5IjoxLCJ3Y2QiOiJhdzEiLCJjbHQiOjAsInN0ayI6InQ5NUNKWG1rcHo0U0lkMV9aUndTOUduZElhdlNMRGtja3U5aFh2LVcwbUEuQUcuTTFxWFcxc3d0Zmw2TWFQR21hVHczWnU0V0I5Vmt3S1hoc3h5Uk1telplVFBaeXBZMk9lY0RzblpUclJqREMxWExubTJTeFk5djNHS0NwNC5KTGFBZWNkcjJIZ2N6TVFyMllvNE9BLk44bnJubEhSVlA0OFROTVQiLCJleHAiOjE2MDcyMDg0NzgsImlhdCI6MTYwNzIwMTI3OCwiYWlkIjoidV96UmVSbWhSWWlLY0U2dzdhQVpoZyIsImNpZCI6IiJ9.NXPpvZRL80AVFMVyqaXhKO1hKywkFbYyze48LtOxTWw",
    join_url:
      "https://zoom.us/j/93398173560?pwd=c2dnaFMzTzkvSmgzZnhaUVZYb2lwdz09",
    password: "u4UrGs",
  });
  let meetings = await manager.getAll();
  expect(meetings.length).toBeGreaterThan(0);
});

test("can find a meeting by uuid", async () => {
  let meeting = await manager.getMeeting("JtcANK6eSaWGRSAgN8xg+Q==");
  expect(meeting).toBeDefined();
  expect(meeting.start_url).toEqual("the place to be");
});

test("can get all meetings", async () => {
  let meetings = await manager.getAll();
  expect(meetings.length).toBeGreaterThan(0);
  expect(meetings[0].uuid).toEqual("123");
});
