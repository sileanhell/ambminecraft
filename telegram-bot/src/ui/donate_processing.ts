import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
}

const amount = (): ReturnType => ({
  caption: "💵 <b>Укажите сумму пожертвований</b>",
  parse_mode: "HTML",
  inline_keyboard: [
    [
      {
        text: "« Отменить",
        callback_data: "menu",
      },
    ],
  ],
});

const method = (amount: string): ReturnType => ({
  caption: "💵 <b>Выберите удобный для вас способ оплаты.</b>",
  parse_mode: "HTML",
  inline_keyboard: [
    [
      {
        text: "💳 РФ Карта",
        callback_data: `donate_card_${amount}`,
      },
      {
        text: "🏦 СБП",
        callback_data: `donate_sbp_${amount}`,
      },
    ],
    [
      {
        text: "« Отменить",
        callback_data: "menu",
      },
    ],
  ],
});

export const UI_DonateProcessing = { amount, method };
