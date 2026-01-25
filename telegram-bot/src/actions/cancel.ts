import { awaitingMessage } from "@/controllers/awaitingMessage";
import type { Context } from "grammy";

export const cancel = async (ctx: Context) => {
  if (!ctx.from) return;
  awaitingMessage.clear(ctx.from.id);
  await ctx.deleteMessage();
};
