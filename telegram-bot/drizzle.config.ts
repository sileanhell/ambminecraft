import type { Config } from "drizzle-kit";

export default {
  dialect: "mysql",
  schema: "./src/database/tables/*",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASS!,
    database: process.env.DATABASE_BASE!,
  },
} satisfies Config;
