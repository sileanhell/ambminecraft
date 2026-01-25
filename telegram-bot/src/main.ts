import { Payments } from "@/controllers/payments";
import { Bot } from "grammy";
import { db } from "./database/connect";
import { register } from "./register";

try {
  await db.execute("SELECT 1");
  console.log("[ DATABASE ] Подключение установлено.");
} catch (error) {
  console.log("[ DATABASE ] Ошибка подключения к базе.");
  console.log(error);
  process.exit();
}

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

try {
  register(bot);
  await bot.init();
  console.log(`[ TELEGRAM ] Бот инициализирован.`);
  await bot.api.setMyCommands([
    { command: "menu", description: "Меню бота" },
    { command: "docs", description: "Политика конфиденциальности и пользовательское соглашение" },
  ]);
  console.log(`[ TELEGRAM ] Команды обновлены.`);
  bot.start();
} catch (error) {
  console.log("[ TELEGRAM ] Ошибка при запуске бота.");
  console.log(error);
  process.exit();
}

Payments.check();
