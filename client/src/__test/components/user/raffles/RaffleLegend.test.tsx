import RaffleLegend from "@/components/user/raffles/RaffleLegend";
import { render, screen } from "@testing-library/react";


describe("RaffleLegend", () => {
    it("muestra los estados de los tickets", () => {
        render(<RaffleLegend />);

        expect(screen.getByText("Disponible")).toBeInTheDocument();
        expect(screen.getByText("Reservado")).toBeInTheDocument();
        expect(screen.getByText("Comprado")).toBeInTheDocument();
    });
});
