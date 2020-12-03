import Authorization from './Authorization';
import Request from './TimeRequest';

export default class Session {
    /**
     * @param {String} teamId Slack Team Id
     * @param {String} userId Slack User Id
     */
    constructor(teamId, userId) {
        /**
         * @type {String} Slack Team Id
         */
        this.teamId = teamId;
        /**
         * @type {String} Slack User Id
         */
        this.userId = userId;
        /**
         * @type {Authorization}
         */
        this.authorization = null;
        /**
         * @type {Request[]}
         */
        this.requests = [];
    }

    timeRequest(ts) {
        return this.requests.find(r => r.ts == ts);
    }
}