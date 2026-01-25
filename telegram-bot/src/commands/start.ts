import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { users } from "@/database/tables/users";
import { UI_Menu } from "@/ui/menu";
import { UI_RegisterLogin } from "@/ui/register_login";
import { UI_RegisterPassword } from "@/ui/register_password";
import { eq } from "drizzle-orm";
import { InputMediaBuilder, type Context } from "grammy";

export const start = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await login(ctx);

  const { caption, inline_keyboard, parse_mode, image } = UI_Menu(user.nickname);
  await ctx.replyWithPhoto(image, { caption, parse_mode, reply_markup: { inline_keyboard } });
};

const login = async (ctx: Context) => {
  if (!ctx.from) return;

  const regex = /^[a-zA-Z0-9_]+$/;

  const { caption, inline_keyboard, parse_mode, image } = UI_RegisterLogin();
  const msg = await ctx.replyWithPhoto(image, { caption, parse_mode, reply_markup: { inline_keyboard } });

  awaitingMessage.add(ctx.from.id, async (login) => {
    if (!ctx.from) return;
    awaitingMessage.clear(ctx.from.id);

    if (login.length < 3 || login.length > 16) {
      await ctx.editMessageCaption({
        caption: "⛔️ <b>Длина логина должа быть от 3 до 16 символов.</b>",
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
      await ctx.editMessageCaption({
        caption: "⛔️ <b>Используйте для логина только латинские буквы, цифры и нижнее подчёркивание.</b>",
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
      await password(ctx, login, msg.message_id);
    }
  });
};

const password = async (ctx: Context, login: string, message_id: number) => {
  if (!ctx.from) return;

  const { caption, inline_keyboard, parse_mode, image } = UI_RegisterPassword();
  await ctx.api.editMessageMedia(ctx.from.id, message_id, InputMediaBuilder.photo(image, { caption, parse_mode }), {
    reply_markup: { inline_keyboard },
  });

  awaitingMessage.add(ctx.from.id, async (password) => {
    if (!ctx.from || !ctx.msg) return;
    awaitingMessage.clear(ctx.from.id);

    if (password.length < 6 || password.length > 72) {
      await ctx.api.editMessageCaption(ctx.from.id, message_id, {
        caption: "⛔️ <b>Длина пароля должна быть от 6 до 72 символов.</b>",
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
      const bcryptHash = await Bun.password.hash(password, { algorithm: "bcrypt", cost: 4 });
      await db.insert(users).values({ telegram_id: ctx.from.id, nickname: login, password: bcryptHash });
      await ctx.api.deleteMessage(ctx.from.id, message_id);
      await start(ctx);
    }
  });
};
