import { bigint, boolean, char, datetime, mysqlTable, text, tinyint } from "drizzle-orm/mysql-core";

export const payments = mysqlTable("payments", {
  transactionId: char({ length: 36 }).primaryKey(),
  telegram_id: bigint({ mode: "number", unsigned: true }).notNull(),
  target: tinyint().notNull(),
  method: text().notNull(),
  status: text().notNull(),
  amount: text().notNull(),
  createdAt: datetime().notNull(),
  updateAt: datetime().notNull(),
  hidden: boolean().default(false),
});
