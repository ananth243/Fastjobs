import { Sequelize } from "sequelize";

const DB_PATH = process.env.DB_PATH as string;

export const sequelize = new Sequelize(DB_PATH, {
  dialect: "postgres",
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync({alter: true});
  } catch (error) {
    process.exit(0);
  }
};
