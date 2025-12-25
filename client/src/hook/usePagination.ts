"use client";

import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(items: T[], itemsPerPage = 9) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / itemsPerPage)
  );

  useEffect(() => {
    setPage(1);
  }, [items]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  const nextPage = () =>
    setPage((p) => Math.min(p + 1, totalPages));

  const prevPage = () =>
    setPage((p) => Math.max(p - 1, 1));

  return {
    page,
    totalPages,
    items: paginatedItems,
    setPage,
    nextPage,
    prevPage,
  };
}
