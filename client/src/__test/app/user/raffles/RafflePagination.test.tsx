import RafflesPagination from "@/components/user/raffles/RafflesPagination";
import { render, screen, fireEvent } from "@testing-library/react";


describe("RafflePagination", () => {
    it("llama a setPage al navegar", () => {
        const setPage = jest.fn();
        render(<RafflesPagination  currentPage={2} totalPages={5} setCurrentPage={setPage} />);

        fireEvent.click(screen.getByText("Anterior"));
        fireEvent.click(screen.getByText("Siguiente"));

        expect(setPage).toHaveBeenCalledTimes(2);
    });
});
