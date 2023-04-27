import { oauthClient } from "@/util/auth";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  url: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];
  const url = oauthClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // Use this for development
  });
  return res.json({ url });
}
