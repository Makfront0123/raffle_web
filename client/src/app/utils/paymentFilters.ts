import { Payment } from "@/type/Payment";

export function applyFilters({
  payments,
  status,
  from,
  to,
}: {
  payments: Payment[];
  status: "all" | "completed" | "pending" | "expired";
  from: string;
  to: string;
}) {
  return payments.filter((p) => {
    const paymentDate = new Date(p.created_at);

    // 🔹 Filtrado por status correcto
    const statusMatch =
      status === "all"
        ? true
        : status === "completed"
          ? p.status === "completed"
          : status === "pending"
            ? p.status === "pending"
            : status === "expired"
              ? p.status === "expired"
              : false;

    const fromValid = from ? paymentDate >= new Date(from) : true;
    const toValid = to ? paymentDate <= new Date(to) : true;

    return statusMatch && fromValid && toValid;
  });
}