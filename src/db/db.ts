import { Sequelize } from "sequelize";
import { connectDB, sequelize } from "./connect";
import { User } from "./user";
import { Slot } from "./slot";

interface DB {
  sequelize: Sequelize;
  connect: () => Promise<void>;
}

User.hasMany(Slot, {
  sourceKey: "id",
  foreignKey: "UserId",
  as: "availableSlots",
});

Slot.belongsTo(User, { targetKey: "id" });

let db: DB = {
  sequelize: sequelize,
  connect: connectDB,
};

export default db;
