import SessionManager from "../SessionManager";
import { Session } from "../Session";

const manager = new SessionManager();

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
