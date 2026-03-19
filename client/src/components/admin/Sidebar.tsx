"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Ticket, Gift, Users, Settings } from "lucide-react";
export function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Rifas", icon: Ticket, href: "/rafflesAdmin" },
        { label: "Pagos", icon: Gift, href: "/payments" },
        { label: "Ganadores", icon: Users, href: "/winners" },
        { label: "Proveedores", icon: Settings, href: "/providers" },
        { label: "Crear Prizes", icon: Gift, href: "/prizes" },
    ];


    return (
        <aside className="w-64 bg-white shadow-lg px-4 py-6">
            <h2 className="text-xl font-bold text-indigo-600 mb-8">
                Admin Panel
            </h2>

            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                                    active
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
