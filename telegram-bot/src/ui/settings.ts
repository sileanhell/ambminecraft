import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
  image: string;
}

export const UI_Settings = (minecraft_nickname: string): ReturnType => ({
  caption: ["ㅤ", "\n", `◾️ <b>Логин:</b> ${minecraft_nickname}`, "\n", "◾️ <b>Пароль:</b> Зашифровано", "\n", "ㅤ"].join(""),
  parse_mode: "HTML",
  inline_keyboard: [
    [
      {
        text: "️🏷 Изменить логин",
        callback_data: "change_login",
      },
      {
        text: "️🔑 Изменить пароль",
        callback_data: "change_password",
      },
    ],
    [
      {
        text: "« В меню",
        callback_data: "menu",
      },
    ],
  ],
  image: "https://eco18.com/wp-content/uploads/2020/06/AdobeStock_77967812-scaled.jpeg",
});
