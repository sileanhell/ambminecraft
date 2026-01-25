import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
}

export const UI_ChangeLogin = (): ReturnType => ({
  caption: [
    "⛔️ <b>В настоящее время эта функция отключена.</b>",
    "\n\n",
    "<i>Если вам очень нужно изменить логин, свяжитесь с администрацией.</i>",
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [
    [
      {
        text: "« Назад",
        callback_data: "settings",
      },
    ],
  ],
});
