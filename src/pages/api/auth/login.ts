// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
    access_type: "online",
    scope: scopes,
  });
  return res.json({ url });
}
