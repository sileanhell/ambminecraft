import type { InlineKeyboardButton, ParseMode } from "grammy/types";

type ReturnType = () => {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
  image: string;
};

export const UI_RegisterLogin: ReturnType = () => ({
  caption: [
    "🏷 <b>Укажите ник в игре, он будет привязан к вашему Telegram аккаунту.</b>",
    "\n\n",
    "<i>Длина ника от 3 до 16 символов.</i>",
    "\n",
    "<i>Только латинские буквы, цифры и нижнее подчёркивание.</i>",
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
