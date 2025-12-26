export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  created_at?: Date;
}


export interface WhatsappReceiptDto {
  phone: string;
  raffleName: string;
  tickets: string[];   // ✅ array real
  amount: number;
}
