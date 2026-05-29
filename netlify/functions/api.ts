import { getConnectionString } from "@netlify/database";
import serverless from "serverless-http";

let cachedHandler: ReturnType<typeof serverless> | undefined;

export const handler = async (event: unknown, context: unknown) => {
  try {
    process.env.DATABASE_URL = getConnectionString();
  } catch {
    process.env.DATABASE_URL ||= process.env.NETLIFY_DB_URL;
  }

  if (!process.env.DATABASE_URL) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "DATABASE_URL is missing from Netlify environment variables."
      })
    };
  }

  process.env.FRONTEND_URL ||= process.env.URL || "https://mathsprints.netlify.app";
  process.env.NODE_ENV ||= "production";

  if (!cachedHandler) {
    const { createApp } = await import("../../server/dist/app.js");
    cachedHandler = serverless(createApp());
  }

  return cachedHandler(event as any, context as any);
};
export const config = {
  path: "/api/*"
};
