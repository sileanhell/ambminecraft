import { bigint, boolean, char, double, float, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const authme = mysqlTable("authme", {
  id: int({ unsigned: true }).autoincrement().primaryKey(),
  telegram_id: bigint({ mode: "number", unsigned: true }).unique().notNull(),
  username: varchar({ length: 16 }).unique().notNull(),
  realname: varchar({ length: 16 }).unique().notNull(),
  password: char({ length: 60 }).notNull(),
  ip: varchar({ length: 15 }),
  lastlogin: bigint({ mode: "number" }),
  x: double().default(0),
  y: double().default(0),
  z: double().default(0),
  world: varchar({ length: 255 }).default("world"),
  regdate: bigint({ mode: "number" }).default(0),
  regip: varchar({ length: 15 }),
  yaw: float(),
  pitch: float(),
  email: varchar({ length: 255 }),
  isLogged: boolean().default(false),
  hasSession: boolean().default(false),
  totp: varchar({ length: 32 }),
});
