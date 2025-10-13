export interface AppRoute {
  name: string;
  path: string;
  children?: AppRoute[];
}

// Rutas que se usan en el header del usuario
export const appRoutes: AppRoute[] = [
  {
    name: "Usuario",
    path: "/",
    children: [
      { name: "Inicio", path: "/" },
      { name: "Rifas", path: "/raffles" },
      { name: "Mis Reservas", path: "/my-reservations" },
      { name: "Perfil", path: "/profile" },
    ],
  },
  {
    name: "Admin",
    path: "/admin",
    children: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Rifas", path: "/admin/raffles" },
      { name: "Pagos", path: "/admin/payments" },
      { name: "Ganadores", path: "/admin/winners" },
    ],
  },
];
