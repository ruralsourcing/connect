"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SessionManager_1 = __importDefault(require("../SessionManager"));
class TestableSessionContext {
    getAll() {
        return new Promise((resolve, reject) => {
            resolve([{}]);
        });
    }
    get(uuid) {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }
    post(item) {
        throw new Error("Method not implemented.");
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    put(item) {
        throw new Error("Method not implemented.");
    }
}
const manager = new SessionManager_1.default(new TestableSessionContext());
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
            slackTeamId: "1",
            slackUserId: "2",
            name: "",
            email: "",
        },
    ];
    manager.sessions = sessions;
    expect(manager.sessions.length).toEqual(1);
});
test("knows that a user is not authorized", () => {
    expect(manager.authorized("1", "2")).toBeFalsy();
});
test("can add authorization to session", () => {
    var _a, _b;
    expect((_a = manager.session("1", "2")) === null || _a === void 0 ? void 0 : _a.authorization).toBeUndefined();
    manager.addAuthorization("1", "2", "123", "dfed");
    expect((_b = manager.session("1", "2")) === null || _b === void 0 ? void 0 : _b.authorization).toBeDefined();
});
test("knows that a user is authorized", () => {
    expect(manager.authorized("1", "2")).toBeTruthy();
});
test("can return an authorization header", () => {
    expect(manager.authorizationHeader("1", "2")).toEqual("Bearer 123");
});
