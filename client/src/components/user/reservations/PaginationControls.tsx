import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

export default function PaginationControls({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (newPage: number) => void;
}) {
  return (
    <Pagination className="mb-10">
      <PaginationContent className="text-white">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onChange(Math.max(1, page - 1))}
            className="cursor-pointer bg-black border border-white"
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i + 1}
              onClick={() => onChange(i + 1)}
              className={page === i + 1
                ? "bg-white text-black"
                : "bg-black text-white hover:bg-white/20"
              }
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onChange(Math.min(totalPages, page + 1))}
            className="cursor-pointer bg-black border border-white"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
