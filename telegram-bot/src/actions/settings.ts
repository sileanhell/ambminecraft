import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { users } from "@/database/tables/users";
import { UI_Settings } from "@/ui/settings";
import { eq } from "drizzle-orm";
import { InputMediaBuilder, type Context } from "grammy";

export const settings = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await ctx.deleteMessage().catch(() => {});

  const { caption, parse_mode, inline_keyboard, image } = UI_Settings(user.nickname);
  await ctx.editMessageMedia(InputMediaBuilder.photo(image, { caption, parse_mode }), { reply_markup: { inline_keyboard } });
};
