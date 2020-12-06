import SessionManager from "../SessionManager";
import { Session } from "../Session";
import { Meeting } from "../Meeting";

const manager = new SessionManager();
const payload = {
    uuid: "JtcANK6eSaWGRSAgN8xg+Q==",
    id: 93398173560,
    host_id: "eyxXfnupQvWNjXJcNoD7Xg",
    host_email: "david@federnet.com",
    topic: "CASpR Support",
    type: 1,
    status: "waiting",
    timezone: "America/Indianapolis",
    agenda: "Understanding the reducer pattern in React",
    created_at: "2020-12-05T20:47:58Z",
    start_url:
      "https://zoom.us/s/93398173560?zak=eyJ6bV9za20iOiJ6bV9vMm0iLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQiLCJ1aWQiOiJleXhYZm51cFF2V05qWEpjTm9EN1hnIiwiaXNzIjoid2ViIiwic3R5IjoxLCJ3Y2QiOiJhdzEiLCJjbHQiOjAsInN0ayI6InQ5NUNKWG1rcHo0U0lkMV9aUndTOUduZElhdlNMRGtja3U5aFh2LVcwbUEuQUcuTTFxWFcxc3d0Zmw2TWFQR21hVHczWnU0V0I5Vmt3S1hoc3h5Uk1telplVFBaeXBZMk9lY0RzblpUclJqREMxWExubTJTeFk5djNHS0NwNC5KTGFBZWNkcjJIZ2N6TVFyMllvNE9BLk44bnJubEhSVlA0OFROTVQiLCJleHAiOjE2MDcyMDg0NzgsImlhdCI6MTYwNzIwMTI3OCwiYWlkIjoidV96UmVSbWhSWWlLY0U2dzdhQVpoZyIsImNpZCI6IiJ9.NXPpvZRL80AVFMVyqaXhKO1hKywkFbYyze48LtOxTWw",
    join_url:
      "https://zoom.us/j/93398173560?pwd=c2dnaFMzTzkvSmgzZnhaUVZYb2lwdz09",
    password: "u4UrGs",
    h323_password: "056718",
    pstn_password: "056718",
    encrypted_password: "c2dnaFMzTzkvSmgzZnhaUVZYb2lwdz09",
    settings: {
      host_video: false,
      participant_video: false,
      cn_meeting: false,
      in_meeting: false,
      join_before_host: false,
      mute_upon_entry: false,
      watermark: false,
      use_pmi: false,
      approval_type: 2,
      audio: "voip",
      auto_recording: "none",
      enforce_login: false,
      enforce_login_domains: "",
      alternative_hosts: "",
      close_registration: false,
      show_share_button: false,
      allow_multiple_devices: false,
      registrants_confirmation_email: true,
      waiting_room: true,
      request_permission_to_unmute_participants: false,
      registrants_email_notification: true,
      meeting_authentication: false,
      encryption_type: "enhanced_encryption",
      approved_or_denied_countries_or_regions: { enable: false },
    },
  } as Meeting;

test("can create a session", () => {
  const session = manager.session("1", "2");
  expect(session).toBeDefined();
});

test("can retrieve a session", () => {
  const session = manager.session("1", "2");
  expect(session).toBeDefined();
});

test("can get all sessions", () => {
  expect(manager.sessions).toBeDefined();
});

test("can initialize sessions", () => {
  const sessions = [
    {
      teamId: "1",
      userId: "2",
      name: "",
      email: "",
      meetings: [],
    }
  ] as Session[];
  manager.sessions = sessions;
  expect(manager.sessions.length).toEqual(1);
});

test("knows that a user is not authorized", () => {
  expect(manager.authorized("1", "2")).toBeFalsy();
});

test("can add authorization to session", () => {
  expect(manager.session("1", "2")?.authorization).toBeUndefined();
  manager.addAuthorization("1", "2", "123", "dfed");
  expect(manager.session("1", "2")?.authorization).toBeDefined();
});

test("knows that a user is authorized", () => {
  expect(manager.authorized("1", "2")).toBeTruthy();
});

test("can return an authorization header", () => {
  expect(manager.authorizationHeader("1", "2")).toEqual("Bearer 123");
});

test("can add meetings from zoom payload", () => {
    let session = manager.session("1", "2");
    manager.addMeeting(session, payload);
    expect(session.meetings?.length).toBeGreaterThan(0);
  });
  
  test("can find a meeting by uuid", () => {
    let meeting = manager.getMeeting("JtcANK6eSaWGRSAgN8xg+Q==");
    expect(meeting).toBeDefined();
  });
