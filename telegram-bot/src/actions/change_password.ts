import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { authme } from "@/database/tables/authme";
import { users } from "@/database/tables/users";
import { UI_ChangePassword } from "@/ui/change_password";
import { eq } from "drizzle-orm";
import type { Context } from "grammy";
import { settings } from "./settings";

export const change_password = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage().catch(() => {});

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await ctx.deleteMessage().catch(() => {});

  const { caption, parse_mode, inline_keyboard } = UI_ChangePassword();
  const msg = await ctx.reply(caption, { parse_mode, reply_markup: { inline_keyboard } });

  awaitingMessage.add(ctx.from.id, async (password) => {
    if (!ctx.from) return;
    awaitingMessage.clear(ctx.from.id);
    await ctx.api.deleteMessage(msg.chat.id, msg.message_id);

    const bcryptHash = await Bun.password.hash(password, { algorithm: "bcrypt", cost: 4 });
    await db.update(users).set({ password: bcryptHash }).where(eq(users.telegram_id, ctx.from.id));
    await db.update(authme).set({ password: bcryptHash, hasSession: false }).where(eq(authme.telegram_id, ctx.from.id));

    await settings(ctx);
  });
};
