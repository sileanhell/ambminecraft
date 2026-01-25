import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { users } from "@/database/tables/users";
import { UI_Menu } from "@/ui/menu";
import { UI_RegisterLogin } from "@/ui/register_login";
import { UI_RegisterPassword } from "@/ui/register_password";
import { eq } from "drizzle-orm";
import type { Context } from "grammy";

export const start = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage().catch(() => {});

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await login(ctx);

  const { caption, inline_keyboard, parse_mode, image } = UI_Menu(user.nickname);
  await ctx.replyWithPhoto(image, { caption, parse_mode, reply_markup: { inline_keyboard } });
};

const login = async (ctx: Context) => {
  if (!ctx.from) return;

  const regex = /^[a-zA-Z0-9_]+$/;

  const { caption, inline_keyboard, parse_mode } = UI_RegisterLogin();
  const msg = await ctx.reply(caption, { parse_mode, reply_markup: { inline_keyboard } });

  awaitingMessage.add(ctx.from.id, async (login) => {
    if (!ctx.from) return;
    awaitingMessage.clear(ctx.from.id);
    await ctx.api.deleteMessage(msg.chat.id, msg.message_id);

    if (login.length < 3 || login.length > 16) {
      await ctx.reply("⛔️ <b>Длина логина должа быть от 3 до 16 символов.</b>", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔄 Попробовать ещё раз",
                callback_data: "menu",
              },
            ],
          ],
        },
      });
    } else if (!regex.test(login)) {
      await ctx.reply("⛔️ <b>Используйте для логина только латинские буквы, цифры и нижнее подчёркивание.</b>", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔄 Попробовать ещё раз",
                callback_data: "menu",
              },
            ],
          ],
        },
      });
    } else {
      await password(ctx, login);
    }
  });
};

const password = async (ctx: Context, login: string) => {
  if (!ctx.from) return;

  const { caption, inline_keyboard, parse_mode } = UI_RegisterPassword();
  const msg = await ctx.reply(caption, { parse_mode, reply_markup: { inline_keyboard } });

  awaitingMessage.add(ctx.from.id, async (password) => {
    if (!ctx.from) return;
    awaitingMessage.clear(ctx.from.id);
    await ctx.api.deleteMessage(msg.chat.id, msg.message_id);

    const bcryptHash = await Bun.password.hash(password, { algorithm: "bcrypt", cost: 4 });
    await db.insert(users).values({ telegram_id: ctx.from.id, nickname: login, password: bcryptHash });
    await start(ctx);
  });
};
