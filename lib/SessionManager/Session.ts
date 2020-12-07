import Authorization from "./Authorization";
import { Meeting } from "./Meeting";

export interface Session {
    teamId: string;
    userId: string;
    name: string ;
    email: string;
    authorization?: Authorization;
    meetings: Meeting[];
}
