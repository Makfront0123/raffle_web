"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Ticket, Gift, Users, Settings } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Rifas", icon: Ticket, href: "/rafflesAdmin" },
        { label: "Pagos", icon: Gift, href: "/payments" },
        { label: "Ganadores", icon: Users, href: "/winners" },
        { label: "Proveedores", icon: Settings, href: "/providers" }, // quienes proveen los premios
        { label: "Crear Prizes", icon: Gift, href: "/prizes" }, // para crear premios
    ];


    return (
        <aside className="w-64 bg-white shadow-md p-4 flex flex-col border-r">
            <h2 className="text-2xl font-bold mb-6 text-purple-700">Admin</h2>
            <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={pathname === item.href ? "default" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-2",
                                pathname === item.href && "bg-purple-600 hover:bg-purple-700 text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
