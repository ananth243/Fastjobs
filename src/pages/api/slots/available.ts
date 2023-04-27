import { sequelize } from "@/db/connect";
import db from "@/db/db";
import { Slot } from "@/db/slot";
import { User } from "@/db/user";
import { Error } from "@/types/commonTypes";
import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

interface Data {
  slots: Slot[];
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error | Data>
) {
  try {
    if (req.method === "POST") {
      const email = req.body.email as string;
      await db.connect();
      const validator = z.string();
      validator.parse(email);
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(500).json({ message: "User does not exist in db" });
      const slots = await Slot.findAll({
        where: { UserId: user.id, booked: false },
      });
      res.json({ slots });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(500).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
