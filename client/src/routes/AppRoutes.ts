export interface AppRoute {
  name: string;
  path: string;
  children?: AppRoute[];
  protected?: boolean;
  roles?: ("user" | "admin")[];
}
export const appRoutes: AppRoute[] = [
  {
    name: "Usuario",
    path: "/",
    children: [
      { name: "Inicio", path: "/" },
      { name: "Rifas", path: "/raffles", protected: true },
      { name: "Mis Reservas", path: "/myReservations", protected: true },
      { name: "Mis Tickets", path: "/myTickets", protected: true },
    ],
  },
  {
    name: "Admin",
    path: "/admin",
    children: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Rifas", path: "/admin/raffles" },
      { name: "Pagos", path: "/admin/payments" },
      { name: "Ganadores", path: "/admin/winners" },
      { name: "Crear Prizes", path: "/prizes" },
      { name: "Proveedores", path: "/providers" },
    ],
  },
];
