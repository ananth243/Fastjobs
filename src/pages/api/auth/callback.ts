// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { oauthClient } from "@/util/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { decode, sign } from "jsonwebtoken";
import { google } from "googleapis";

type Error = {
  message: string;
};

type Data = {
  jwt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  try {
    const SECRET_KEY = process.env.SECRET_KEY as string;
    if (!req.query.code)
      return res.status(400).json({ message: "Authorisation code missing" });
    const code = req.query.code as string;
    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);
    if (!tokens.access_token)
      return res.status(400).json({ message: "Invalid tokens" });
    const userInfo = await google
      .oauth2({ auth: oauthClient, version: "v2" })
      .userinfo.get();
    if (!userInfo) throw new Error("Internal Server Error");
    const { name, picture, email } = userInfo.data;
    const jwt = sign({ name, picture, email }, SECRET_KEY);
    return res.status(200).json({ jwt });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
