import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./connect";
import { Slot } from "./slot";

export class User extends Model<
  InferAttributes<User, { omit: "availableSlots" }>,
  InferCreationAttributes<User, { omit: "availableSlots" }>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare availableSlots: NonAttribute<Slot[]>;
  declare email: string;
  declare refreshToken: string
}

User.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      unique: true,
    },
    refreshToken:{
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "users",
    sequelize: sequelize,
  }
);
