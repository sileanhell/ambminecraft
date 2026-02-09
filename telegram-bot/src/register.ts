import type { Api, Bot, Context, RawApi } from "grammy";
import { back_menu } from "./actions/back_menu";
import { cancel } from "./actions/cancel";
import { change_login } from "./actions/change_login";
import { change_password } from "./actions/change_password";
import { donate } from "./actions/donate";
import { donate_processing } from "./actions/donate_processing";
import { pass } from "./actions/pass";
import { payment_cancel } from "./actions/payment_cancel";
import { payment_card } from "./actions/payment_card";
import { payment_sbp } from "./actions/payment_sbp";
import { settings } from "./actions/settings";
import { docs } from "./commands/docs";
import { start } from "./commands/start";
import { awaitingMessage } from "./controllers/awaitingMessage";
import { PaymentTarget } from "./controllers/payments";

export const register = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("start", (ctx) => start(ctx));
  bot.command("menu", (ctx) => start(ctx));
  bot.command("docs", (ctx) => docs(ctx));

  bot.on("message:text", (ctx) => awaitingMessage.handle(ctx));

  bot.callbackQuery("menu", (ctx) => back_menu(ctx));
  bot.callbackQuery("cancel", (ctx) => cancel(ctx));

  bot.callbackQuery("donate", (ctx) => donate(ctx));
  bot.callbackQuery("donate_processing", (ctx) => donate_processing(ctx));
  // bot.callbackQuery(/^donate_card_(.+)$/, (ctx) => payment_card(ctx, PaymentTarget.Пожертование, ctx.match[1]));
  bot.callbackQuery(/^donate_sbp_(.+)$/, (ctx) => payment_sbp(ctx, PaymentTarget.Пожертование, ctx.match[1]));

  bot.callbackQuery("pass", (ctx) => pass(ctx));
  // bot.callbackQuery("pass_card", (ctx) => payment_card(ctx, PaymentTarget.Проходка, "200"));
  bot.callbackQuery("pass_sbp", (ctx) => payment_sbp(ctx, PaymentTarget.Проходка, "200"));

  bot.callbackQuery("settings", (ctx) => settings(ctx));
  bot.callbackQuery("change_login", (ctx) => change_login(ctx));
  bot.callbackQuery("change_password", (ctx) => change_password(ctx));

  bot.callbackQuery("payment_cancel", (ctx) => payment_cancel(ctx));
};
