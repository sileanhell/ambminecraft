import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { users } from "@/database/tables/users";
import { UI_Donate } from "@/ui/donate";
import { eq } from "drizzle-orm";
import type { Context } from "grammy";

export const donate = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage().catch(() => {});

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await ctx.deleteMessage().catch(() => {});

  const { caption, parse_mode, inline_keyboard, image } = UI_Donate();
  await ctx.replyWithPhoto(image, { caption, parse_mode, reply_markup: { inline_keyboard } });
};
