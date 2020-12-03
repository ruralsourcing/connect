"use strict";

import Session from './Session';
import Authorization from './Authorization';

/**
 * @description Session manager
 */
export default class SessionManager {

    /**
     * @type {Session[]} Current Sessions
     */
    get sessions(){
        if(!this._sessions)
            this._sessions = [];
        
        return this._sessions;
    }

    set sessions(sessions){
        this._sessions = sessions;
    }

    /**
     * @param {String} userId
     * @returns {Boolean} Login Status 
     */
    authorized(teamId, userId) {
        var session = this.sessions.find((x) => { return x.teamId == teamId && x.userId == userId});
        return session != undefined && session.authorization != undefined;
    }

    /**
     * @description Retrieves a user session, or creates on if no session exists
     * @param {String} userId User Id Key
     * @returns {Session} User Session object
     */
    session(teamId, userId) {
        if(this._session(teamId, userId) == undefined){
            this.sessions.push(new Session(teamId, userId));
            return this._session(teamId, userId);
        }
        return this._session(teamId, userId);
    }

    _session(teamId, userId) {
        return this.sessions.find((session) => { return session.teamId == teamId && session.userId == userId});
    }

    authorizationHeader(teamId, userId) {
        return 'Bearer ' + this._session(teamId, userId).authorization.token
    }

    /**
     * @param {String} teamId
     * @param {String} userId 
     * @param {String} token
     * @param {String} username 
     */
    addAuthorization(teamId, userId, token, username){
        if(this.userDoesNotExist(teamId, userId)) return;
        
        this._session(teamId, userId).authorization = new Authorization(token, username);
    }

    userDoesNotExist(teamId, userId) {
        return this._session(teamId, userId) == undefined;
    }
}