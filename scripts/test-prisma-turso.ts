import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

async function main() {
  const adapter = new PrismaLibSql({ 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN 
  });
  const prisma = new PrismaClient({ adapter });
  const events = await prisma.event.findMany({ take: 3 });
  console.log("Events:", events.length);
  events.forEach(e => console.log(" -", e.name, e.eventType));
}

main().catch(e => console.error("ERROR:", e.message));
