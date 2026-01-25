import { UI_Docs } from "@/ui/docs";
import { InputFile, InputMediaBuilder, type Context } from "grammy";
import { join } from "path";

export const docs = async (ctx: Context) => {
  const { caption, parse_mode } = UI_Docs();
  await ctx.replyWithMediaGroup([
    InputMediaBuilder.document(new InputFile(join(process.cwd(), "public", "Политика конфиденциальности.pdf"))),
    InputMediaBuilder.document(new InputFile(join(process.cwd(), "public", "Пользовательское соглашение.pdf")), { caption, parse_mode }),
  ]);
};
