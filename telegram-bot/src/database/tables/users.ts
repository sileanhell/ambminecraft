import { bigint, char, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  telegram_id: bigint({ mode: "number", unsigned: true }).unique().notNull(),
  nickname: varchar({ length: 16 }).unique().notNull(),
  password: char({ length: 60 }).notNull(),
});
