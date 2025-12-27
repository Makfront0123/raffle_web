export interface WompiTransaction {
  status: "APPROVED" | "DECLINED" | "ERROR";
}

export interface WompiCheckoutResult {
  transaction?: WompiTransaction;
}

export interface WompiCheckoutConfig {
  currency: string;
  amountInCents: number;
  reference: string;
  publicKey?: string;
  signature: {
    integrity: string;
  };
}

export interface WompiCheckoutInstance {
  open: (callback: (result: WompiCheckoutResult) => void) => void;
}

export interface WompiCheckoutConstructor {
  new (config: WompiCheckoutConfig): WompiCheckoutInstance;
}
