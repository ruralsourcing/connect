"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Authorization_1 = __importDefault(require("./Authorization"));
/**
 * @description Session manager
 */
class SessionManager {
    constructor(context) {
        this._sessions = [];
        this._context = context;
    }
    get sessions() {
        return this._sessions;
    }
    set sessions(sessions) {
        this._sessions = sessions;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._context.getAll();
        });
    }
    /**
     * @param {String} userId
     * @returns {Boolean} Login Status
     */
    authorized(teamId, userId) {
        var session = this.sessions.find((x) => {
            return x.slackTeamId == teamId && x.slackUserId == userId;
        });
        return session != undefined && session.authorization != undefined;
    }
    /**
     * @description Retrieves a user session, or creates on if no session exists
     * @param {String} userId User Id Key
     * @returns {Session} User Session object
     */
    session(teamId, userId) {
        if (this._session(teamId, userId) === undefined) {
            this._sessions.push({ slackTeamId: teamId, slackUserId: userId });
        }
        let session = this._session(teamId, userId);
        if (!session)
            session = {};
        return session;
    }
    _session(teamId, userId) {
        const session = this._sessions.find((session) => session.slackTeamId == teamId && session.slackUserId == userId);
        return session;
    }
    authorizationHeader(teamId, userId) {
        var _a, _b;
        return "Bearer " + ((_b = (_a = this.session(teamId, userId)) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.token);
    }
    /**
     * @param {String} teamId
     * @param {String} userId
     * @param {String} token
     * @param {String} username
     */
    addAuthorization(teamId, userId, token, username) {
        let session = this.session(teamId, userId);
        session.authorization = new Authorization_1.default(token, username);
    }
}
exports.default = SessionManager;
