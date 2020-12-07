"use strict";

import { Session } from "./Session";
import Authorization from "./Authorization";
import { settings } from "cluster";
import { Meeting } from "./Meeting";

/**
 * @description Session manager
 */
export default class SessionManager {
  private _sessions: Session[];

  constructor() {
    this._sessions = [];
  }

  get sessions(): Session[] {
    return this._sessions;
  }

  set sessions(sessions) {
    this._sessions = sessions;
  }

  /**
   * @param {String} userId
   * @returns {Boolean} Login Status
   */
  authorized(teamId: string, userId: string): boolean {
    var session = this.sessions.find((x) => {
      return x.teamId == teamId && x.userId == userId;
    });
    return session != undefined && session.authorization != undefined;
  }

  /**
   * @description Retrieves a user session, or creates on if no session exists
   * @param {String} userId User Id Key
   * @returns {Session} User Session object
   */
  session(teamId: string, userId: string): Session {
    if (this._session(teamId, userId) === undefined) {
      this._sessions.push({teamId, userId} as Session);
    }
    let session = this._session(teamId, userId);
    if (!session) session = {} as Session;

    return session;
  }

  private _session(teamId: string, userId: string): Session | undefined {
    const session = this._sessions.find(
      (session) => session.teamId == teamId && session.userId == userId
    );
    return session;
  }

  authorizationHeader(teamId: string, userId: string) {
    return "Bearer " + this.session(teamId, userId)?.authorization?.token;
  }

  /**
   * @param {String} teamId
   * @param {String} userId
   * @param {String} token
   * @param {String} username
   */
  addAuthorization(
    teamId: string,
    userId: string,
    token: string,
    username: string
  ) {
    let session = this.session(teamId, userId);
    session.authorization = new Authorization(token, username);
  }

  addMeeting(session: Session, meeting: Meeting) {
      if(!session.meetings)
        session.meetings = [];
    session.meetings.push(meeting);
  }

  getMeeting(uuid: string): Meeting {
    let meeting = null;
    this.sessions.forEach(s => {
        meeting = s.meetings?.find(m => m.uuid === uuid)
    });
    if(!meeting) throw "Something went wrong";
    return meeting;
  }
}
