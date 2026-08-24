import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next reads .env.local, plain dotenv reads .env. Load both, closest first,
// so there is only one place to put the connection strings.
config({ path: [".env.local", ".env"], quiet: true });

/*
  Config for the Prisma CLI only — migrations, generate, seed. The running app
  never reads this file; it connects through the adapter in src/lib/prisma.ts.

  The CLI gets DIRECT_URL rather than DATABASE_URL on purpose. Neon's pooled
  endpoint sits behind PgBouncer, which cannot run the session-level statements
  migrations need.
*/
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
