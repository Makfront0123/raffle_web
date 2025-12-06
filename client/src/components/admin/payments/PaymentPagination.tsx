"use client";

import { Button } from "@/components/ui/button";

type Props = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (n: number) => void;
};

export default function PaymentsPagination({ totalPages, currentPage, setCurrentPage }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Anterior
      </Button>

      <span className="px-4 py-2 bg-gray-100 rounded-lg">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Siguiente
      </Button>
    </div>
  );
}
