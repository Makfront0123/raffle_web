"use client";
import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (n: number) => void;
}

export default function RafflesPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <Button
        variant="purple"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
      >
        ← Anterior
      </Button>

      <span className="text-sm text-gray-700">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        variant="purple"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
      >
        Siguiente →
      </Button>
    </div>
  );
}
