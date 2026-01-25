import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
  image: string;
}

export const UI_Donate = (): ReturnType => ({
  caption: [
    "💵 <b>Поддержите наш проект!</b>",
    "\n\n",
    "<blockquote><b>Ваши пожертвования пойдут на развитие проекта.</b></blockquote>",
    "\n\n",
    "<i>Любая сумма важна для нас!</i>",
  ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [
    [
      {
        text: "🖊️ Указать сумму",
        callback_data: "donate_processing",
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
