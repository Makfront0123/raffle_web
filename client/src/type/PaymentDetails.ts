export interface PaymentDetails {
    id: number;
    payment: {
        id: number;
        name: string;
        description: string;
        total_amount: string;
        currency: string;
    };
    status: string;
    transactionId: string;
}