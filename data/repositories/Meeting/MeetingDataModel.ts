import { Model, Optional } from "sequelize";

export interface MeetingAttributes {
    id?: number;
    userId?: number;
    uuid: string;
    host_id: string;
    host_email: string;
    topic: string;
    start_url: string;
    join_url: string;
    password: string;
  }

// Some attributes are optional in `User.build` and `User.create` calls
export interface MeetingCreationAttributes
  extends Optional<MeetingAttributes, "id"> {}

export class MeetingDataModel
  extends Model<MeetingAttributes, MeetingCreationAttributes>
  implements MeetingAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public uuid!: string;
  public host_id!: string;
  public host_email!: string;
  public topic!: string;
  public start_url!: string;
  public join_url!: string;
  public password!: string;
  public userId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
