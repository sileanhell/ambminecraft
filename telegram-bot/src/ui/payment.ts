import { PaymentTarget } from "@/controllers/payments";
import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
}

interface Args {
  transactionId: string;
  target: keyof typeof PaymentTarget;
  method: string;
  amount: string;
}

const pending = (args: Args, url: string): ReturnType => ({
  caption: [
    "⏳ <b>Ожидание оплаты</b>",
    "\n\n",
    `ID транзакции: ${args.transactionId}`,
    "\n",
    `Назначение: ${args.target}`,
    "\n",
    `Способ: ${args.method}`,
    "\n",
    `Сумма: ${args.amount}`,
    "\n\n",
    "<i>Пожалуйста, оплатите или отмените платёж.</i>",
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [
    [
      {
        text: "🌐 Перейти к оплате",
        url,
      },
    ],
    [
      {
        text: "❌ Отменить",
        callback_data: "payment_cancel",
      },
    ],
  ],
});

const cancled = (args: Args): ReturnType => ({
  caption: [
    "❌ <b>Платеж отменен</b>",
    "\n\n",
    `ID транзакции: ${args.transactionId}`,
    "\n",
    `Назначение: ${args.target}`,
    "\n",
    `Способ: ${args.method}`,
    "\n",
    `Сумма: ${args.amount}`,
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [],
});

const confirmed = (args: Args): ReturnType => ({
  caption: [
    "✅ <b>Платеж успешно оплачен!</b>",
    "\n\n",
    `ID транзакции: ${args.transactionId}`,
    "\n",
    `Назначение: ${args.target}`,
    "\n",
    `Способ: ${args.method}`,
    "\n",
    `Сумма: ${args.amount}`,
    "\n\n",
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [],
});

const chargebacked = (args: Args): ReturnType => ({
  caption: [
    "⚠️ <b>Спорная ситуация</b>",
    "\n\n",
    `ID транзакции: ${args.transactionId}`,
    "\n",
    `Назначение: ${args.target}`,
    "\n",
    `Способ: ${args.method}`,
    "\n",
    `Сумма: ${args.amount}`,
    "\n\n",
    "<i>Платеж находится в спорной ситуации.</i>",
    "\n",
    "<i>Пожалуйста, обратитесь к администрации для решения проблемы.</i>",
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [],
});

export const UI_Payment = { pending, cancled, confirmed, chargebacked };
