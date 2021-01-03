import { Skill } from '@prisma/client';
import SkillDataContext, { ISkillDataContext } from '../../data/SkillDataContext';
import {DataSource} from "apollo-datasource";

export default class SkillDataSource extends DataSource {
  private context: ISkillDataContext;
  constructor(context: ISkillDataContext) {
    super();
    this.context = new SkillDataContext();
  }

  getAllSkills = async (): Promise<Skill[]> => {
    return await this.context.getAll();
  }
}