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
  console.log("📍 paginator:", { currentPage, totalPages });

 if (totalPages === 0) return null;


  return (
    <div className="flex justify-center items-center gap-8 mt-10">
      <Button
        variant="outline"
        className="border-gold text-gold hover:bg-gold/20 text-black"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        ← Anterior
      </Button>

      <span className="text-gold/80 text-sm">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        variant="outline"
        className="border-gold text-gold hover:bg-gold/20 text-black"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Siguiente →
      </Button>
    </div>

  );
}
