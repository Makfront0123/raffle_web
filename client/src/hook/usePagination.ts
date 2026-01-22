"use client";

import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(items: T[] = [], itemsPerPage = 9) {
  const [page, setPage] = useState(1);
  const safeItems = useMemo(() => items || [], [items]);

  const totalPages = Math.max(1, Math.ceil(safeItems.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [safeItems]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return safeItems.slice(start, start + itemsPerPage);
  }, [safeItems, page, itemsPerPage]);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return { page, totalPages, items: paginatedItems, setPage, nextPage, prevPage };
}
