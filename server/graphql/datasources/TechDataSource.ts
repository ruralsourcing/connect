import { Tech } from '@prisma/client';
import TechDataContext, { ITechDataContext } from '../../data/TechDataContext';
import {DataSource} from "apollo-datasource";

export default class TechDataSource extends DataSource {
  private context: ITechDataContext;
  constructor(context: ITechDataContext) {
    super();
    this.context = context;
  }

  getById = async (id: string): Promise<Tech | null> => {
    return await this.context.get(id);
  }

  getAllTech = async (): Promise<Tech[]> => {
    return await this.context.getAll();
  }
}