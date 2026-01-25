import { start } from "@/commands/start";
import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { users } from "@/database/tables/users";
import { UI_Menu } from "@/ui/menu";
import { eq } from "drizzle-orm";
import { InputMediaBuilder, type Context } from "grammy";

export const back_menu = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await start(ctx);

  const { caption, inline_keyboard, parse_mode, image } = UI_Menu(user.nickname);
  await ctx.editMessageMedia(InputMediaBuilder.photo(image, { caption, parse_mode }), { reply_markup: { inline_keyboard } });
};
