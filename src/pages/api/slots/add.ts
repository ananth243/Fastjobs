import db from "@/db/db";
import { Slot } from "@/db/slot";
import { Error, JWTPayload } from "@/types/commonTypes";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error>
) {
  try {
    if (req.method === "POST") {
      const SECRET_KEY = process.env.SECRET_KEY as string;
      if (!req.headers.token)
        return res.status(400).json({ message: "Auth token missing" });
      const token = req.headers.token as string;
      const { id } = verify(token, SECRET_KEY) as JWTPayload;
      const slots = req.body.slots as Date[][];
      await db.connect();
      console.log(slots);
      let bulkCreate = slots.map((slot) => {
        return { start: slot[0], end: slot[1], UserId: id, booked: false };
      });
      Slot.bulkCreate(bulkCreate);
      return res.status(200).json({ message: "Successfully created slots" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
