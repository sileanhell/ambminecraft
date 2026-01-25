import { db } from "@/database/connect";
import { payments } from "@/database/tables/payments";
import { bot } from "@/main";
import { Platega } from "@/services/platega";
import { Reward } from "@/services/reward";
import { UI_Payment } from "@/ui/payment";
import { eq } from "drizzle-orm";

export enum PaymentTarget {
  Проходка,
  Пожертование,
}

const check = async () => {
  for (const payment of await db.select().from(payments).where(eq(payments.hidden, false))) {
    const payment_info = await Platega.getStatus(payment.transactionId);
    if (!payment_info) continue;

    if (payment_info.status === "PENDING" && payment.updateAt.getTime() + 10 * 60 * 1000 <= Date.now()) {
      await pending({
        transactionId: payment_info.id,
        target: payment.target,
        method: payment.method,
        amount: payment.amount,
        status: payment_info.status,
        url: `https://pay.platega.io?id=${payment_info.id}&mh=${payment_info.mechantId}`,
        telegram_id: payment.telegram_id,
      });
    }

    if (payment_info.status === "CANCELED") {
      await cancled({
        transactionId: payment_info.id,
        target: payment.target,
        method: payment.method,
        amount: payment.amount,
        status: payment_info.status,
        telegram_id: payment.telegram_id,
      });
    }

    if (payment_info.status === "CONFIRMED") {
      await confirmed({
        transactionId: payment_info.id,
        target: payment.target,
        method: payment.method,
        amount: payment.amount,
        status: payment_info.status,
        telegram_id: payment.telegram_id,
      });
    }

    if (payment_info.status === "CHARGEBACKED") {
      await chargebacked({
        transactionId: payment_info.id,
        target: payment.target,
        method: payment.method,
        amount: payment.amount,
        status: payment_info.status,
        telegram_id: payment.telegram_id,
      });
    }
  }

  setTimeout(check, 60 * 1000);
};

const pending = async (args: {
  transactionId: string;
  target: number;
  status: string;
  method: string;
  amount: string;
  url: string;
  telegram_id: number;
}) => {
  await db.update(payments).set({ status: args.status, updateAt: new Date() }).where(eq(payments.transactionId, args.transactionId));
  const { caption, parse_mode, inline_keyboard } = UI_Payment.pending(
    {
      transactionId: args.transactionId,
      target: PaymentTarget[args.target] as keyof typeof PaymentTarget,
      method: args.method,
      amount: args.amount,
    },
    args.url,
  );
  await bot.api.sendMessage(args.telegram_id, caption, { parse_mode, reply_markup: { inline_keyboard } }).catch(() => {});
};

const cancled = async (args: {
  transactionId: string;
  target: number;
  status: string;
  method: string;
  amount: string;
  telegram_id: number;
}) => {
  await db
    .update(payments)
    .set({ status: args.status, updateAt: new Date(), hidden: true })
    .where(eq(payments.transactionId, args.transactionId));
  const { caption, parse_mode, inline_keyboard } = UI_Payment.cancled({
    transactionId: args.transactionId,
    target: PaymentTarget[args.target] as keyof typeof PaymentTarget,
    method: args.method,
    amount: args.amount,
  });
  await bot.api.sendMessage(args.telegram_id, caption, { parse_mode, reply_markup: { inline_keyboard } }).catch(() => {});
};

const confirmed = async (args: {
  transactionId: string;
  target: number;
  status: string;
  method: string;
  amount: string;
  telegram_id: number;
}) => {
  await db
    .update(payments)
    .set({ status: args.status, updateAt: new Date(), hidden: true })
    .where(eq(payments.transactionId, args.transactionId));
  const { caption, parse_mode, inline_keyboard } = UI_Payment.confirmed({
    transactionId: args.transactionId,
    target: PaymentTarget[args.target] as keyof typeof PaymentTarget,
    method: args.method,
    amount: args.amount,
  });
  await bot.api.sendMessage(args.telegram_id, caption, { parse_mode, reply_markup: { inline_keyboard } }).catch(() => {});
  await Reward(args.telegram_id, args.target);
};

const chargebacked = async (args: {
  transactionId: string;
  target: number;
  status: string;
  method: string;
  amount: string;
  telegram_id: number;
}) => {
  await db
    .update(payments)
    .set({ status: args.status, updateAt: new Date(), hidden: true })
    .where(eq(payments.transactionId, args.transactionId));
  const { caption, parse_mode, inline_keyboard } = UI_Payment.chargebacked({
    transactionId: args.transactionId,
    target: PaymentTarget[args.target] as keyof typeof PaymentTarget,
    method: args.method,
    amount: args.amount,
  });
  await bot.api.sendMessage(args.telegram_id, caption, { parse_mode, reply_markup: { inline_keyboard } }).catch(() => {});
};

export const Payments = { check };
