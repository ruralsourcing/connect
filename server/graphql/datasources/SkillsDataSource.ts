import { Skill } from "@prisma/client";
import SkillDataContext, {
  ISkillDataContext,
} from "../../data/SkillDataContext";
import { DataSource } from "apollo-datasource";

export default class SkillDataSource extends DataSource {
  private context: ISkillDataContext;
  constructor(context: ISkillDataContext) {
    super();
    this.context = new SkillDataContext();
  }

  getById = async (id: string): Promise<Skill | null> => {
    return await this.context.get(id);
  };

  getAllSkills = async (userId: number): Promise<Skill[]> => {
    return await this.context.getSkillsForUser(userId);
  };

  create = async (
    technologyId: number,
    rating: number,
    userId: number
  ): Promise<Skill> => {
    return await this.context.createSkillForUser({
      rating,
      technologyId,
    }, userId);
  };
}
