export interface WompiWidgetConfig {
  currency: string;
  amountInCents: number;
  reference: string;
  publicKey: string;
  acceptanceToken: string;
  signature: {
    integrity: string;
  };
}

export interface WompiTransaction {
  id: string;
  reference: string;
  status: "APPROVED" | "DECLINED" | "ERROR" | "PENDING";
}

export interface WompiResult {
  transaction?: WompiTransaction;
}

export interface WompiCheckoutInstance {
  open(callback: (result: WompiResult) => void): void;
}

export type WompiCheckoutConstructor = new (
  config: WompiWidgetConfig
) => WompiCheckoutInstance;