import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
  image: string;
}

export const UI_Menu = (minecraft_nickname: string): ReturnType => ({
  caption: `<b>Привет <code>${minecraft_nickname}</code>!</b>`,
  parse_mode: "HTML",
  inline_keyboard: [
    [
      {
        text: "🚪 Купить проходку",
        callback_data: "pass",
      },
    ],
    [
      {
        text: "💵 Пожертвовать проекту",
        callback_data: "donate",
      },
    ],
    [
      {
        text: "⚙️ Настройки",
        callback_data: "settings",
      },
    ],
  ],
  image: "https://eco18.com/wp-content/uploads/2020/06/AdobeStock_77967812-scaled.jpeg",
});
