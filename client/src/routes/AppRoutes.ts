export interface AppRoute {
  name: string;
  path: string;
  children?: AppRoute[];
  protected?: boolean;
  roles?: ("user" | "admin")[];
}export const appRoutes: AppRoute[] = [
  {
    name: "Usuario",
    path: "/",
    children: [
      { name: "Inicio", path: "/" },
      {
        name: "Rifas",
        path: "/raffles",
        protected: true,
        roles: ["user", "admin"],
      },
      {
        name: "Mis Reservas",
        path: "/myReservations",
        protected: true,
        roles: ["user"],
      },
      {
        name: "Mis Tickets",
        path: "/myTickets",
        protected: true,
        roles: ["user"],
      },
    ],
  },
  {
    name: "Admin",
    path: "/admin",
    children: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        protected: true,
        roles: ["admin"],
      },
      {
        name: "Rifas",
        path: "/admin/raffles",
        protected: true,
        roles: ["admin"],
      },
      {
        name: "Pagos",
        path: "/admin/payments",
        protected: true,
        roles: ["admin"],
      },
      {
        name: "Ganadores",
        path: "/admin/winners",
        protected: true,
        roles: ["admin"],
      },
      {
        name: "Prizes",
        path: "/admin/prizes",
        protected: true,
        roles: ["admin"],
      },
      {
        name: "Proveedores",
        path: "/admin/providers",
        protected: true,
        roles: ["admin"],
      },
    ],
  },
];
