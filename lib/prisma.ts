import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

prisma
  .$connect()
  .then(() => console.log("Prisma connected successfully."))
  .catch((err) => console.error("Error connecting to Prisma:", err));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
