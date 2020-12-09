import { Model, Optional } from "sequelize";

// These are all the attributes in the User model
export interface ZoomAuthorizationAttributes {
  id: number;
  token: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
export interface ZoomAuthorizationCreationAttributes
  extends Optional<ZoomAuthorizationAttributes, "id"> {}

export class ZoomAuthorizationDataModel
  extends Model<ZoomAuthorizationAttributes, ZoomAuthorizationCreationAttributes>
  implements ZoomAuthorizationAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public token!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
