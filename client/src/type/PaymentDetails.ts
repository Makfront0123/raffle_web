export interface PaymentDetails {
    id: number;
    payment: {
        id: number;
        name: string;
        description: string;
        amount: number;
        currency: string;
    };
    status: string;
    transactionId: string;
}