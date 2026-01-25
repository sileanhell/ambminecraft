import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
}

export const UI_ChangePassword = (): ReturnType => ({
  caption: [
    "✏️ <b>Укажите новый пароль для аккаунта.</b>",
    "\n\n",
    "<i>Максимальная длина 72 символов.</i>",
    "\n\n",
    "<blockquote>Мы храним пароли в зашифрованном виде и никто включая нас не сможет узнать реальный пароль.</blockquote>",
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
