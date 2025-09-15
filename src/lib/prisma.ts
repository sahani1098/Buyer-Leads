import { PrismaClient } from "@prisma/client";

declare global {
  // Ensures global `prisma` is recognized by TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"], // optional logging
  });

// Prevent creating new instances on hot-reload in dev
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
