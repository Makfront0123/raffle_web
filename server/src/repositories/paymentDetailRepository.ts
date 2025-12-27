import { AppDataSource } from "../data-source";
import { PaymentDetail } from "../entities/payment_details.entity";

export const paymentDetailRepository =
  AppDataSource.getRepository(PaymentDetail);
