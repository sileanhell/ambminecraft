import { awaitingMessage } from "@/controllers/awaitingMessage";
import { PaymentTarget } from "@/controllers/payments";
import { db } from "@/database/connect";
import { payments } from "@/database/tables/payments";
import { bot } from "@/main";
import { UI_Payment } from "@/ui/payment";
import { and, eq } from "drizzle-orm";
import type { Context } from "grammy";

export const payment_cancel = async (ctx: Context) => {
  if (!ctx.from || !ctx.msg || !ctx.msg.text) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage().catch(() => {});

  const match = ctx.msg.text.match(/ID транзакции:\s*([\w-]+)/);
  if (!match || !match[1]) return;

  const payment = (
    await db
      .select()
      .from(payments)
      .where(and(eq(payments.telegram_id, ctx.from.id), eq(payments.transactionId, match[1]), eq(payments.hidden, false)))
  )[0];
  if (!payment) return;

  await db.update(payments).set({ hidden: true }).where(eq(payments.transactionId, payment.transactionId));

  const { caption, parse_mode, inline_keyboard } = UI_Payment.cancled({
    transactionId: payment.transactionId,
    target: PaymentTarget[payment.target] as keyof typeof PaymentTarget,
    method: payment.method,
    amount: payment.amount,
  });
  await bot.api.sendMessage(ctx.from.id, caption, { parse_mode, reply_markup: { inline_keyboard } }).catch(() => {});
};
