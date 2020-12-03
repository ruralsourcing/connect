import Authorization from './Authorization';

export default class Session {

    teamId: string;
    userId: string;
    authorization?: Authorization;

    constructor(teamId: string, userId: string) {
        this.teamId = teamId;
        this.userId = userId;
    }
}