import './schema';
import { UserRepo } from "./repositories/User/UserRepo";
import { ZoomAuthorizationRepo } from './repositories/ZoomAuthorization/ZoomAuthorizationRepo';
import { MeetingRepo } from './repositories/Meeting/MeetingRepo';


export default class CASpR {
  Users: UserRepo;
  ZoomAuthorizations: ZoomAuthorizationRepo;
  Meetings: MeetingRepo;

  constructor(){
      this.Users = new UserRepo();
      this.ZoomAuthorizations = new ZoomAuthorizationRepo();
      this.Meetings = new MeetingRepo();
  }
};
