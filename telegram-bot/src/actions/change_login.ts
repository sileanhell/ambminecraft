import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { users } from "@/database/tables/users";
import { UI_ChangeLogin } from "@/ui/change_login";
import { eq } from "drizzle-orm";
import type { Context } from "grammy";

export const change_login = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage().catch(() => {});

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await ctx.deleteMessage().catch(() => {});

  const { caption, parse_mode, inline_keyboard } = UI_ChangeLogin();
  await ctx.reply(caption, { parse_mode, reply_markup: { inline_keyboard } });
};
