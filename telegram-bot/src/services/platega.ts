import ky from "ky";

const api = ky.create({
  prefixUrl: "https://app.platega.io/",
  headers: {
    "X-MerchantId": process.env.PLATEGA_MERCHANT_ID,
    "X-Secret": process.env.PLATEGA_SECRET,
  },
});

export enum PaymentMethod {
  SBP = 2,
  CARD = 10,
}

export type StatusType = "PENDING" | "CANCELED" | "CONFIRMED" | "CHARGEBACKED";

const createUrl = async (payload: { method: PaymentMethod; amount: string; description: string }) => {
  const response = await api
    .post("transaction/process", {
      json: {
        paymentMethod: payload.method,
        paymentDetails: {
          amount: Number(payload.amount),
          currency: "RUB",
        },
        description: payload.description,
        return: "https://google.com/success",
        failedUrl: "https://google.com/fail",
      },
    })
    .catch(() => undefined);
  if (!response) throw new Error("Не удалось обратится к платежному сервису.");
  if (!response.ok) return;

  return (await response.json()) as {
    paymentMethod: string;
    transactionId: string;
    redirect: string;
    return: string;
    paymentDetails: string;
    status: StatusType;
    expiresIn: string;
    merchantId: string;
    usdtRate: number;
    cryptoAmount: number;
  };
};

const getStatus = async (transactionId: string) => {
  const response = await api.get(`transaction/${transactionId}`).catch(() => undefined);
  if (!response) throw new Error("Не удалось обратится к платежному сервису.");
  if (!response.ok) return;

  return (await response.json()) as {
    id: string;
    status: StatusType;
    paymentDetails: {
      amount: number;
      currency: string;
    };
    merchantName: string;
    mechantId: string;
    comission: number;
    paymentMethod: string;
    expiresIn: string;
    accountData: string;
    return: string;
    comissionUsdt: number;
    amountUsdt: number;
    qr: string;
    payformSuccessUrl: string;
    payload: string;
    comissionType: number;
    externalId: string;
    description: string;
    createdAt: string;
    paymentProvider: string;
  };
};

export const Platega = { createUrl, getStatus };
