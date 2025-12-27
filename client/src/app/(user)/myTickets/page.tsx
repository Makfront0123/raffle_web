"use client";

import { useState } from "react";
import { paginate } from "@/app/utils/paginate";
import MyTicketsView from "@/components/user/tickets/MyTicketsView";
import { usePayment } from "@/hook/usePayment";
import { Payment, PaymentStatusEnum } from "@/type/Payment";
import { Raffle } from "@/type/Raffle";

export default function MyTickets() {
  const { userPayments, loading } = usePayment();

  const [search, setSearch] = useState("");
  const [filterRaffle, setFilterRaffle] = useState<"all" | number>("all");
  const [page, setPage] = useState(1);

  if (loading) return <div>Cargando pagos...</div>;

  const completedPayments = userPayments.filter(
    (p: Payment) => p.status === PaymentStatusEnum.COMPLETED && p.raffle
  );


  const uniqueRaffles = Array.from(
    new Map(
      completedPayments
        .map((p: Payment) => p.raffle)
        .filter(Boolean)
        .map((r: Raffle) => [r.id, r])
    ).values()
  );

  const filteredPayments = completedPayments.filter((payment: Payment) => {
    const matchesRaffle =
      filterRaffle === "all" || payment.raffle.id === filterRaffle;

    const matchesSearch = payment.raffle.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesRaffle && matchesSearch;
  });
  const { totalPages, currentItems } = paginate(filteredPayments, page, 10);

  return (
    <MyTicketsView
      search={search}
      filterRaffle={filterRaffle}
      page={page}
      totalPages={totalPages}
      currentPayments={currentItems}
      uniqueRaffles={uniqueRaffles}
      onSearch={(v) => {
        setSearch(v);
        setPage(1);
      }}
      onFilter={(v) => {
        setFilterRaffle(v);
        setPage(1);
      }}
      onPageChange={setPage}
    />
  );
}
