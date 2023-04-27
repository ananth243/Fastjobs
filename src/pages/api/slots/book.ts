import db from "@/db/db";
import { Slot } from "@/db/slot";
import { User } from "@/db/user";
import { Error, JWTPayload } from "@/types/commonTypes";
import { makeCalendarAppointment } from "@/util/calendar";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import { ZodError, z } from "zod";

interface Data {
  slot: Slot;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error | Data>
) {
  try {
    if (req.method === "POST") {
      const email = req.body.email as string;
      const { start: startDate, end: endDate } = req.body as {
        start: Date;
        end: Date;
      };
      const emailValidator = z.string();
      emailValidator.parse(email);
      const date = z.object({
        startDate: z.string().transform((str) => new Date(str)),
        endDate: z.string().transform((str) => new Date(str)),
      });
      date.parse({ startDate, endDate });
      await db.connect();
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(500).json({ message: "User does not exist in db" });
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
      if (!req.headers.token)
        return res.status(400).json({ message: "Auth token missing" });
      const token = req.headers.token as string;
      const { email: bookerEmail, name: bookerName } = verify(
        token,
        JWT_SECRET_KEY
      ) as JWTPayload;
      if (email === bookerEmail || startDate === endDate)
        return res.status(500).json({ message: "Do not try funnny stuff" });
      const slot = await Slot.findOne({
        where: {
          UserId: user.id,
          booked: false,
          start: {
            [Op.lte]: startDate,
          },
          end: {
            [Op.gte]: endDate,
          },
        },
      });
      if (!slot)
        return res
          .status(200)
          .json({ message: "User not free during this slot" });
      await makeCalendarAppointment(
        bookerEmail,
        bookerName,
        user.name,
        startDate,
        endDate,
        user.refreshToken
      );
      slot.booked = true;
      await slot.save();
      return res.json({ message: "Saved slot successfully" });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
