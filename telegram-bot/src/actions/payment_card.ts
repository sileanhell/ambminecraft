import { awaitingMessage } from "@/controllers/awaitingMessage";
import { PaymentTarget } from "@/controllers/payments";
import { db } from "@/database/connect";
import { payments } from "@/database/tables/payments";
import { users } from "@/database/tables/users";
import { PaymentMethod, Platega } from "@/services/platega";
import { UI_Payment } from "@/ui/payment";
import { eq } from "drizzle-orm";
import { InputMediaBuilder, type Context } from "grammy";

export const payment_card = async (ctx: Context, target: PaymentTarget, amount?: string) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);

  const user = (await db.select().from(users).where(eq(users.telegram_id, ctx.from.id)))[0];
  if (!user) return await ctx.deleteMessage().catch(() => {});

  if (!amount || !amount.match(/^-?\d+(\.\d+)?$/)) return;

  const payment = await Platega.createUrl({ amount, method: PaymentMethod.CARD, description: "Test Message" });
  if (payment) {
    const time = new Date();
    await db.insert(payments).values({
      transactionId: payment.transactionId,
      telegram_id: ctx.from.id,
      target,
      method: payment.paymentMethod,
      status: payment.status,
      amount: payment.paymentDetails,
      createdAt: time,
      updateAt: time,
    });
    const { caption, parse_mode, inline_keyboard, image } = UI_Payment.pending(
      {
        transactionId: payment.transactionId,
        target: PaymentTarget[target] as keyof typeof PaymentTarget,
        method: payment.paymentMethod,
        amount: payment.paymentDetails,
      },
      payment.redirect,
    );
    await ctx.editMessageMedia(InputMediaBuilder.photo(image, { caption, parse_mode }), { reply_markup: { inline_keyboard } });
  } else {
    await ctx.editMessageCaption({
      caption: "⛔️ <b>Не удалось создать платёж.</b>",
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
  }
};
