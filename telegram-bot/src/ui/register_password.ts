import type { InlineKeyboardButton, ParseMode } from "grammy/types";

type ReturnType = () => {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
};

export const UI_RegisterPassword: ReturnType = () => ({
  caption: [
    "🔑 <b>Укажите пароль который будет использоваться для авторизации на сервере.</b>",
    "\n\n",
    "<i>Максимальная длина 72 символов.</i>",
    "\n\n",
    "<blockquote>Мы храним пароли в зашифрованном виде и никто включая нас не сможет его узнать.</blockquote>",
  ].join(""),
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
