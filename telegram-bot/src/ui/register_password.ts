import type { InlineKeyboardButton, ParseMode } from "grammy/types";

type ReturnType = () => {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
  image: string;
};

export const UI_RegisterPassword: ReturnType = () => ({
  caption: [
    "🔑 <b>Укажите пароль который будет использоваться для авторизации на сервере.</b>",
    "\n\n",
    "<i>Длина пароля от 6 до 72 символов.</i>",
    "\n\n",
    "<blockquote>Мы храним пароли в зашифрованном виде и никто включая нас не сможет его узнать.</blockquote>",
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [
    [
      {
        text: "Отменить",
        callback_data: "cancel",
      },
    ],
  ],
  image: "https://eco18.com/wp-content/uploads/2020/06/AdobeStock_77967812-scaled.jpeg",
});
