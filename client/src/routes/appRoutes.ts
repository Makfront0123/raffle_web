export const appRoutes = [
    {
        path: "/",
        component: "./pages/index.astro",
        children: [
            {
                name: "Home",
                path: "/",
                component: "./pages/index.astro",
            },
            {
                name: "Raffles",
                path: "/raffles",
                component: "./pages/raffles.astro",
            },
            {
                name: "Winners",
                path: "/winners",
                component: "./pages/winners.astro",
            },
        ],
    },
];