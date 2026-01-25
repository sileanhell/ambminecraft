import { awaitingMessage } from "@/controllers/awaitingMessage";
import { db } from "@/database/connect";
import { users } from "@/database/tables/users";
import { UI_DonateProcessing } from "@/ui/donate_processing";
import { eq } from "drizzle-orm";
import type { Context } from "grammy";

export const donate_processing = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage().catch(() => {});

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await ctx.deleteMessage().catch(() => {});

  await amount(ctx);
};

const amount = async (ctx: Context) => {
  if (!ctx.from) return;

  const { caption, parse_mode, inline_keyboard } = UI_DonateProcessing.amount();
  const msg = await ctx.reply(caption, { parse_mode, reply_markup: { inline_keyboard } });

  awaitingMessage.add(ctx.from.id, async (amount) => {
    if (!ctx.from) return;
    awaitingMessage.clear(ctx.from.id);
    await ctx.api.deleteMessage(msg.chat.id, msg.message_id);

    if (!amount.match(/^-?\d+(\.\d+)?$/)) {
      await ctx.reply("⛔️ <b>Сумма указана не верно.</b>", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "« Назад",
                callback_data: "donate",
              },
            ],
          ],
        },
      });
    } else {
      await method(ctx, amount);
    }
  });
};

const method = async (ctx: Context, amount: string) => {
  if (!ctx.from) return;

  const { caption, parse_mode, inline_keyboard } = UI_DonateProcessing.method(amount);
  await ctx.reply(caption, { parse_mode, reply_markup: { inline_keyboard } });
};
