import Authorization from "./Authorization";
import { Meeting } from "../MeetingManager/Meeting";

export interface Session {
    id: string;
    userId: string;
    slackTeamId: string;
    slackUserId: string;
    name: string ;
    email: string;
    authorization?: Authorization;
}
