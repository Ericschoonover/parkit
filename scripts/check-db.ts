import { createClient } from "@libsql/client";

async function main() {
  const c = createClient({ 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN 
  });
  const r = await c.execute("SELECT count(*) as cnt FROM Event");
  console.log("Events:", r.rows[0].cnt);
}

main().catch(console.error);
