import { Session } from "../SessionManager/Session";
import { Skill } from "../SkillsManager/Skill";

export interface User {
  id: string;
  name: string;
//   sessionId: number;
//   skillsId: number;
  session: Session;
  skils: Skill[];
}
