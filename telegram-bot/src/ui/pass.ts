import type { InlineKeyboardButton, ParseMode } from "grammy/types";

interface ReturnType {
  caption: string;
  parse_mode: ParseMode;
  inline_keyboard: InlineKeyboardButton[][];
  image: string;
}

export const UI_Pass = (existAccount: boolean): ReturnType => ({
  caption: existAccount
    ? `⚠️ <b>У вас уже есть проходка на сервер.</b>`
    : [
        "🚪 <b>Покупая проходу вы сможетей зайти и играть на нашем сервере.</b>",
        "\n\n",
        "<blockquote><b>Стоимость проходки:</b> <u>200 рублей</u></blockquote>",
        "\n\n",
        "<i>Выберите способ оплаты ниже или вернитесь в меню.</i>",
      ].join(""),
  parse_mode: "HTML",
  inline_keyboard: [
    ...[
      existAccount
        ? []
        : [
            {
              text: "💳 РФ Карта",
              callback_data: "pass_card",
            },
            {
              text: "🏦 СБП",
              callback_data: "pass_sbp",
            },
          ],
    ],
    [
      {
        text: "« Назад",
        callback_data: "menu",
      },
    ],
  ],
  image: "https://eco18.com/wp-content/uploads/2020/06/AdobeStock_77967812-scaled.jpeg",
});
