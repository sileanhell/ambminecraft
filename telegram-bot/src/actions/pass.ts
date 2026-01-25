import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { authme } from "@/database/tables/authme";
import { users } from "@/database/tables/users";
import { UI_Pass } from "@/ui/pass";
import { eq } from "drizzle-orm";
import type { Context } from "grammy";

export const pass = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage().catch(() => {});

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await ctx.deleteMessage().catch(() => {});

  const minecraft_account = (await db.select().from(authme).where(eq(authme.telegram_id, ctx.from.id)))[0];
  const { caption, parse_mode, inline_keyboard, image } = UI_Pass(Boolean(minecraft_account));
  await ctx.replyWithPhoto(image, { caption, parse_mode, reply_markup: { inline_keyboard } });
};
