import { google } from "googleapis";

const {
  GOOGLE_CLIENT_SECRET: client_secret,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: client_id,
  SERVER_URL: server,
} = process.env;

export const oauthClient = new google.auth.OAuth2(
  client_id,
  client_secret,
  `${server}/api/auth/callback`
);