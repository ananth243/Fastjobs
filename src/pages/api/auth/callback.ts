import { oauthClient } from "@/util/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";
import { google } from "googleapis";
import db from "@/db/db";
import { User } from "@/db/user";
import { Error } from "@/types/commonTypes";

type Data = {
  jwt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
    if (!req.query.code)
      return res.status(400).json({ message: "Authorisation code missing" });
    const code = req.query.code as string;
    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);
    console.log(tokens);
    if (!tokens.access_token || !tokens.refresh_token)
      return res.status(400).json({ message: "Invalid tokens" });
    const userInfo = await google
      .oauth2({ auth: oauthClient, version: "v2" })
      .userinfo.get();
    if (!userInfo) throw new Error("Internal Server Error");
    const { name, email } = userInfo.data;
    if (!email || !name)
      return res.status(400).json({ message: "Error occurred" });
    await db.connect();
    let user = await User.findOne({ where: { email } });
    if (!user)
      user = await User.create({
        name,
        email,
        refreshToken: tokens.refresh_token,
      });
    const jwt = sign({ name, email, id: user.id }, JWT_SECRET_KEY);
    return res.status(200).json({ jwt });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
