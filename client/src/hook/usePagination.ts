"use client";

import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], itemsPerPage = 9) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / itemsPerPage)
  );

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  return {
    page,
    totalPages,
    setPage,
    items: paginatedItems,
  };
}
