import { DataTypes } from "sequelize";
import { UserDataModel } from "./repositories/User/UserDataModel";
import { Sequelize } from "sequelize";
import { ZoomAuthorizationDataModel } from "./repositories/ZoomAuthorization/ZoomAuthorizationDataModel";
import { MeetingDataModel } from "./repositories/Meeting/MeetingDataModel";

const sequelize = new Sequelize("sqlite:./data/db.sqlite", {
  logging: console.log,
}); // Example for sqlite

UserDataModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    preferredName: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    slackTeamId: {
      type: new DataTypes.STRING(16),
      allowNull: false,
    },
    slackUserId: {
      type: new DataTypes.STRING(16),
      allowNull: false,
    },
  },
  {
    modelName: "User",
    sequelize, // passing the `sequelize` instance is required
  }
);

ZoomAuthorizationDataModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
  },
  {
    modelName: "ZoomAuthorization",
    sequelize, // passing the `sequelize` instance is required
  }
);

MeetingDataModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    host_email: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
    host_id: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
    join_url: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
    password: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
    start_url: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
    topic: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
    uuid: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
  },
  {
    modelName: "Meeting",
    sequelize, // passing the `sequelize` instance is required
  }
);

UserDataModel.hasOne(ZoomAuthorizationDataModel, {
  foreignKey: {
    allowNull: true,
  },
});

UserDataModel.hasMany(MeetingDataModel, {
    foreignKey: "id_user"
});
MeetingDataModel.belongsTo(UserDataModel, {
    foreignKey: "id_user"
});
ZoomAuthorizationDataModel.belongsTo(UserDataModel);

sequelize.sync({ force: true })
