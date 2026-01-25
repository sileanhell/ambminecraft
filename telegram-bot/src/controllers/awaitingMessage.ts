import type { Context } from "grammy";

type CallbackType = (message: string) => Promise<unknown> | unknown;

const stack: Map<number, CallbackType> = new Map();

const add = (telegram_id: number, callback: CallbackType) => {
  stack.set(telegram_id, callback);
};

const clear = (telegram_id: number) => {
  const stackItem = stack.get(telegram_id);
  if (!stackItem) return;
  stack.delete(telegram_id);
};

const handle = async (ctx: Context) => {
  if (!ctx.from) return;
  const callback = stack.get(ctx.from.id);
  if (!callback || !ctx.msg || !ctx.msg.text) return;
  await ctx.api.deleteMessage(ctx.from.id, ctx.msg.message_id).catch(() => {});
  await callback(ctx.msg.text);
};

export const awaitingMessage = { add, handle, clear };
