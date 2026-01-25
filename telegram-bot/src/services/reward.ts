import { PaymentTarget } from "@/controllers/payments";
import { db } from "@/database/connect";
import { authme } from "@/database/tables/authme";
import { users } from "@/database/tables/users";
import { eq } from "drizzle-orm";

export const Reward = async (telegram_id: number, target: PaymentTarget) => {
  if (target === PaymentTarget.Проходка) {
    const user = (await db.select().from(users).where(eq(users.telegram_id, telegram_id)))[0];
    if (!user) return;

    const minecraft = (await db.select().from(authme).where(eq(authme.telegram_id, telegram_id)))[0];
    if (minecraft) await db.delete(authme).where(eq(authme.telegram_id, telegram_id));

    await db
      .insert(authme)
      .values({ telegram_id, username: user.nickname.toLowerCase(), realname: user.nickname, password: user.password });
  }
};
