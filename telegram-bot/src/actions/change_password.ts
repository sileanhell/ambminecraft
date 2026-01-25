import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { authme } from "@/database/tables/authme";
import { users } from "@/database/tables/users";
import { UI_ChangePassword } from "@/ui/change_password";
import { eq } from "drizzle-orm";
import type { Context } from "grammy";

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

    if (password.length < 6 || password.length > 72) {
      await ctx.editMessageCaption({
        caption: "⛔️ <b>Длина пароля должна быть от 6 до 72 символов.</b>",
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔄 Попробовать ещё раз",
                callback_data: "change_password",
              },
            ],
          ],
        },
      });
      return;
    }

    const bcryptHash = await Bun.password.hash(password, { algorithm: "bcrypt", cost: 4 });
    await db.update(users).set({ password: bcryptHash }).where(eq(users.telegram_id, ctx.from.id));
    await db.update(authme).set({ password: bcryptHash, hasSession: false }).where(eq(authme.telegram_id, ctx.from.id));

    await ctx.editMessageCaption({
      caption: "✅ <b>Пароль изменён.</b>",
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "« В меню",
              callback_data: "menu",
            },
          ],
        ],
      },
    });
  });
};
