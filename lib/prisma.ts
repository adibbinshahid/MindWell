import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

function makePrismaClient(): PrismaClient {
  // Turso (production / Vercel): use libsql adapter
  if (process.env.TURSO_DATABASE_URL) {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN ?? "",
    });
    const adapter = new PrismaLibSQL(libsql);
    // @ts-expect-error – adapter type accepted by Prisma 5 preview
    return new PrismaClient({ adapter, log: ["error"] });
  }
  // Local dev: plain SQLite file via DATABASE_URL=file:./dev.db
  return new PrismaClient({ log: ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
