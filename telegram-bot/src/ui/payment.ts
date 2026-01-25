import { PaymentTarget } from "@/controllers/payments";
import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
  image: string;
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
    `◾️ <b>ID транзакции:</b> <code>${args.transactionId}</code>`,
    "\n",
    `◾️ <b>Назначение:</b> ${args.target}`,
    "\n",
    `◾️ <b>Способ:</b> ${args.method}`,
    "\n",
    `◾️ <b>Сумма:</b> ${args.amount}`,
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
  image: "https://eco18.com/wp-content/uploads/2020/06/AdobeStock_77967812-scaled.jpeg",
});

const cancled = (args: Args): ReturnType => ({
  caption: [
    "❌ <b>Платеж отменен</b>",
    "\n\n",
    `◾️ <b>ID транзакции:</b> <code>${args.transactionId}</code>`,
    "\n",
    `◾️ <b>Назначение:</b> ${args.target}`,
    "\n",
    `◾️ <b>Способ:</b> ${args.method}`,
    "\n",
    `◾️ <b>Сумма:</b> ${args.amount}`,
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [],
  image: "https://eco18.com/wp-content/uploads/2020/06/AdobeStock_77967812-scaled.jpeg",
});

const confirmed = (args: Args): ReturnType => ({
  caption: [
    "✅ <b>Платеж успешно оплачен!</b>",
    "\n\n",
    `◾️ <b>ID транзакции:</b> <code>${args.transactionId}</code>`,
    "\n",
    `◾️ <b>Назначение:</b> ${args.target}`,
    "\n",
    `◾️ <b>Способ:</b> ${args.method}`,
    "\n",
    `◾️ <b>Сумма:</b> ${args.amount}`,
    "\n\n",
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [],
  image: "https://eco18.com/wp-content/uploads/2020/06/AdobeStock_77967812-scaled.jpeg",
});

const chargebacked = (args: Args): ReturnType => ({
  caption: [
    "⚠️ <b>Спорная ситуация</b>",
    "\n\n",
    `◾️ <b>ID транзакции:</b> <code>${args.transactionId}</code>`,
    "\n",
    `◾️ <b>Назначение:</b> ${args.target}`,
    "\n",
    `◾️ <b>Способ:</b> ${args.method}`,
    "\n",
    `◾️ <b>Сумма:</b> ${args.amount}`,
    "\n\n",
    "<i>Платеж находится в спорной ситуации.</i>",
    "\n",
    "<i>Пожалуйста, обратитесь к администрации для решения проблемы.</i>",
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [],
  image: "https://eco18.com/wp-content/uploads/2020/06/AdobeStock_77967812-scaled.jpeg",
});

export const UI_Payment = { pending, cancled, confirmed, chargebacked };
