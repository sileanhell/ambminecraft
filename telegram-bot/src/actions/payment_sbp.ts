import { awaitingMessage } from "@/controllers/awaitingMessage";
import { PaymentTarget } from "@/controllers/payments";
import { db } from "@/database/connect";
import { payments } from "@/database/tables/payments";
import { PaymentMethod, Platega } from "@/services/platega";
import { UI_Payment } from "@/ui/payment";
import type { Context } from "grammy";

export const payment_sbp = async (ctx: Context, target: PaymentTarget, amount?: string) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage().catch(() => {});

  if (!amount || !amount.match(/^-?\d+(\.\d+)?$/)) return;

  const payment = await Platega.createUrl({ amount, method: PaymentMethod.SBP, description: "Test Message" });
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
    const { caption, parse_mode, inline_keyboard } = UI_Payment.pending(
      {
        transactionId: payment.transactionId,
        target: PaymentTarget[target] as keyof typeof PaymentTarget,
        method: payment.paymentMethod,
        amount: payment.paymentDetails,
      },
      payment.redirect,
    );
    await ctx.reply(caption, { parse_mode, reply_markup: { inline_keyboard } });
  } else {
    await ctx.reply("⛔️ <b>Не удалось создать платёж.</b>", { parse_mode: "HTML" });
  }
};
