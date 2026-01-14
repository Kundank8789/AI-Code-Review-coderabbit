import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["repo"],
    },
  },

  trustedOrigins: [
    "https://min-recent-spiritedly.ngrok-free.dev",
  ],

  cookies: {
    secure: true,
    sameSite: "none",

    // 🔥 THIS IS THE MISSING PIECE
    domain: "min-recent-spiritedly.ngrok-free.dev",
  },

  // 🔥 TRUST PROXY HEADERS FROM NGROK
  advanced: {
    proxyHeaders: true,
  },

  debug: true,
});
