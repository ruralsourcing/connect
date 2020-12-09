"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Authorization_1 = __importDefault(require("../Authorization"));
const session = { slackTeamId: "1", slackUserId: "2" };
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
    session.authorization = new Authorization_1.default("123", "testuser");
    expect(session.authorization).toBeDefined();
    expect(session.authorization.token).toEqual("123");
    expect(session.authorization.username).toEqual("testuser");
});
