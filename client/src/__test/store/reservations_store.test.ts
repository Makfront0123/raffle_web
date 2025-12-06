import { act } from "@testing-library/react";
import { useReservationStore } from "@/store/reservationStore";
import { ReservationService } from "@/services/reservationService";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() }
}));

jest.mock("@/services/reservationService");

describe("ReservationStore", () => {
  beforeEach(() => {
    useReservationStore.setState({ reservations: [] });
    jest.clearAllMocks();
  });

  const mockReservation = {
    id: 1,
    created_at: "2024",
    expires_at: "2024",
    userId: 10,
    raffleId: 50,
    reservationTickets: []
  };

  it("getReservations carga reservas", async () => {
    (ReservationService.prototype.getAllReservations as jest.Mock).mockResolvedValue([mockReservation]);

    await act(async () => {
      await useReservationStore.getState().getReservations("token");
    });

    expect(useReservationStore.getState().reservations.length).toBe(1);
  });

  it("getReservationById carga solo 1 reserva", async () => {
    (ReservationService.prototype.getReservationById as jest.Mock).mockResolvedValue(mockReservation);

    await act(async () => {
      await useReservationStore.getState().getReservationById(1, "token");
    });

    expect(useReservationStore.getState().reservations[0].id).toBe(1);
  });

  it("createReservation agrega reserva", async () => {
    (ReservationService.prototype.createReservation as jest.Mock).mockResolvedValue(mockReservation);

    await act(async () => {
      await useReservationStore.getState().createReservation(10, 20, "token");
    });

    expect(useReservationStore.getState().reservations.length).toBe(1);
  });

  it("getAllReservationsByUser carga reservas del usuario", async () => {
    (ReservationService.prototype.getAllReservationsByUser as jest.Mock).mockResolvedValue([mockReservation]);

    await act(async () => {
      await useReservationStore.getState().getAllReservationsByUser("token");
    });

    expect(useReservationStore.getState().reservations.length).toBe(1);
  });

  it("cancelReservation elimina reserva y muestra toast", async () => {
    useReservationStore.setState({ reservations: [mockReservation] });

    (ReservationService.prototype.cancelReservation as jest.Mock).mockResolvedValue({
      message: "Reserva cancelada"
    });

    await act(async () => {
      await useReservationStore.getState().cancelReservation(1, "token");
    });

    expect(useReservationStore.getState().reservations.length).toBe(0);
    expect(toast.success).toHaveBeenCalledWith("Reserva cancelada");
  });
});
