import db from "@/db/db";
import { Slot } from "@/db/slot";
import { Error, JWTPayload } from "@/types/commonTypes";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error>
) {
  try {
    if (req.method === "POST") {
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
      if (!req.headers.token)
        return res.status(400).json({ message: "Auth token missing" });
      const token = req.headers.token as string;
      const { id } = verify(token, JWT_SECRET_KEY) as JWTPayload;
      const slots = req.body.slots as { start: Date; end: Date }[];
      const date = z.object({
        start: z.string().transform((str) => new Date(str)),
        end: z.string().transform((str) => new Date(str)),
      });
      await db.connect();
      let bulkCreate = slots.map(({ start, end }) => {
        date.parse({ start, end });
        return { start, end, UserId: id, booked: false };
      });
      Slot.bulkCreate(bulkCreate);
      return res.status(200).json({ message: "Successfully created slots" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
