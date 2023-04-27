import { Sequelize } from "sequelize";
import pg from "pg";

const DB_PATH = process.env.DB_PATH as string;

export const sequelize = new Sequelize(DB_PATH, {
  dialect: "postgres",
  dialectModule: pg,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync({ alter: true });
  } catch (error) {
    process.exit(0);
  }
};
