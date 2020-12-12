import Authorization from "../Authorization";
import { Session } from "../Session";

const session = { slackTeamId: "1", slackUserId: "2" } as Session;

test("should have a team Id", () => {
  expect(session.slackTeamId).toEqual("1");
});

test("should have a user Id", () => {
  expect(session.slackTeamId).toEqual("1");
});

test("should initialize with null Authorization", () => {
  expect(session.authorization).toBeUndefined();
});

test("can add an authorization", () => {
  session.authorization = new Authorization("123", "testuser");
  expect(session.authorization).toBeDefined();
  expect(session.authorization.token).toEqual("123");
  expect(session.authorization.username).toEqual("testuser");
});
