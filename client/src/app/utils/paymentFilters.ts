import { Payment } from "@/type/Payment";

export function applyFilters({
  payments,
  status,
  from,
  to,
}: {
  payments: Payment[];
  status: "all" | "completed" | "pending";
  from: string;
  to: string;
}) {
  return payments.filter((p) => {
    const paymentDate = new Date(p.created_at);

    const statusMatch =
      status === "all"
        ? true
        : status === "completed"
        ? p.status === "completed"
        : p.status !== "completed";

    const fromValid = from ? paymentDate >= new Date(from) : true;
    const toValid = to ? paymentDate <= new Date(to) : true;

    return statusMatch && fromValid && toValid;
  });
}
