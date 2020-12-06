import Authorization from './Authorization';

interface Meeting {
    uuid: string;
    host_id: string;
    host_email: string;
    topic: string;
    start_url: string;
    join_url: string;
    password: string;
}
export default class Session {

    teamId: string;
    userId: string;
    name: string = '';
    email: string = '';
    authorization?: Authorization;
    meetings?: Meeting[];


    constructor(teamId: string, userId: string) {
        this.teamId = teamId;
        this.userId = userId;
    }

    addMeeting(meeting: Meeting){
        this.meetings?.push(meeting)
    }
}