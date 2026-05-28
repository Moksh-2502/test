import { getConnectionString } from "@netlify/database";
import serverless from "serverless-http";

process.env.DATABASE_URL ||= getConnectionString();
process.env.FRONTEND_URL ||= process.env.URL || "https://mathsprints.netlify.app";
process.env.NODE_ENV ||= "production";

const { createApp } = await import("../../server/src/app.js");

export const handler = serverless(createApp());
export const config = {
  path: "/api/*"
};
