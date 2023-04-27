import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "./connect";
import { User } from "./user";

export class Slot extends Model<
  InferAttributes<Slot>,
  InferCreationAttributes<Slot>
> {
  declare id: CreationOptional<number>;
  declare start: Date;
  declare end: Date;
  declare UserId: ForeignKey<User["id"]>;
  declare booked: boolean;
}

Slot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    booked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "slots",
    sequelize: sequelize,
  }
);
