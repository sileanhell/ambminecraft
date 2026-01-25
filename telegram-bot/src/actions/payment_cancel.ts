import { awaitingMessage } from "@/controllers/awaitingMessage";
import { PaymentTarget } from "@/controllers/payments";
import { db } from "@/database/connect";
import { payments } from "@/database/tables/payments";
import { UI_Payment } from "@/ui/payment";
import { and, eq } from "drizzle-orm";
import { InputMediaBuilder, type Context } from "grammy";

export const payment_cancel = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);

  const text = ctx.update.callback_query?.message?.caption ?? ctx.msg?.text;
  const match = text?.match(/ID транзакции:\s*([\w-]+)/);
  if (!match?.[1]) return ctx.deleteMessage().catch(() => {});

  const payment = (
    await db
      .select()
      .from(payments)
      .where(and(eq(payments.telegram_id, ctx.from.id), eq(payments.transactionId, match[1]), eq(payments.hidden, false)))
  )[0];
  if (!payment) return await ctx.deleteMessage().catch(() => {});

  await db.update(payments).set({ hidden: true }).where(eq(payments.transactionId, payment.transactionId));

  const { caption, parse_mode, inline_keyboard, image } = UI_Payment.cancled({
    transactionId: payment.transactionId,
    target: PaymentTarget[payment.target] as keyof typeof PaymentTarget,
    method: payment.method,
    amount: payment.amount,
  });

  await ctx.editMessageMedia(InputMediaBuilder.photo(image, { caption, parse_mode }), { reply_markup: { inline_keyboard } });
};
