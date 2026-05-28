import { getConnectionString } from "@netlify/database";
import serverless from "serverless-http";

let cachedHandler: ReturnType<typeof serverless> | undefined;

export const handler = async (event: unknown, context: unknown) => {
  process.env.DATABASE_URL ||= getConnectionString();
  process.env.FRONTEND_URL ||= process.env.URL || "https://mathsprints.netlify.app";
  process.env.NODE_ENV ||= "production";

  if (!cachedHandler) {
    const { createApp } = await import("../../server/dist/app.js");
    cachedHandler = serverless(createApp());
  }

  return cachedHandler(event, context);
};
export const config = {
  path: "/api/*"
};
