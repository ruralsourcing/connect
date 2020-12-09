import { Model, Optional } from "sequelize";

// These are all the attributes in the User model
export interface UserAttributes {
  id: number;
  email: string;
  name: string;
  preferredName: string | null;
  slackUserId: string | null;
  slackTeamId: string | null;
}

// Some attributes are optional in `User.build` and `User.create` calls
export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

export class UserDataModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  public preferredName!: string | null; // for nullable fields
  public email!: string;
  public slackTeamId!: string | null;
  public slackUserId!: string | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
