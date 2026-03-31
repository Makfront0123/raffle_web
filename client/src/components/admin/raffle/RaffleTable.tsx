"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationLink,
} from "@/components/ui/pagination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/user/ConfirmActionDialog";

import RegenerateTicketsButton from "@/components/user/tickets/RegenerateTicketsButton";
import { Raffle } from "@/type/Raffle";
import { EditRaffleDialog } from "@/components/user/raffles/EditRaffleDialog";
import { RafflesTableProps } from "@/type/RaffleTableProps";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ActionItem, TableActionsDropdown } from "@/components/TableActionsDropdown";

export const RafflesTable = ({
    raffles,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    statusFilter,
    setStatusFilter,
    deleteRaffle,
    activateRaffle,
    deactivateRaffle,
    updateRaffle,
}: RafflesTableProps) => {

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    return (
        <Card className="border-none shadow-lg">
            <CardHeader className="space-y-3">
                <CardTitle>Rifas existentes</CardTitle>

                <div className="flex flex-wrap gap-2">
                    {(["all", "pending", "active", "ended"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                setCurrentPage(1);
                                setStatusFilter(status);
                            }}
                            className={cn(
                                "px-3 py-1 text-xs rounded-md border transition",
                                statusFilter === status
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-white hover:bg-gray-50"
                            )}
                        >
                            {status === "all" ? "Todas" : status}
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent>
                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {raffles.length === 0 ? (
                    <p>No hay rifas.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Título</th>
                                        <th className="px-4 py-2">Números</th>
                                        <th className="px-4 py-2">Precio</th>
                                        <th className="px-4 py-2">Dígitos</th>
                                        <th className="px-4 py-2">Estado</th>
                                        <th className="px-4 py-2">Fecha</th>
                                        <th className="px-4 py-2 text-right">Acciones</th>
                                    </tr>
                                </thead>

                                <motion.tbody layout>
                                    <AnimatePresence mode="wait">
                                        {raffles.map((r: Raffle) => {
                                            const isEnded = r.status === "ended";
                                            const expired = new Date(r.end_date) < new Date();

                                            const actions: ActionItem[] = [];
                                            actions.push({
                                                label: "Eliminar",
                                                destructive: true,
                                                customRender: (
                                                    <ConfirmDialog
                                                        title="Eliminar rifa"
                                                        triggerLabel="Eliminar"
                                                        description="¿Seguro que deseas eliminar esta rifa?"
                                                        variant="ghost"
                                                        onConfirm={() => deleteRaffle(r.id)}
                                                    />
                                                ),
                                            });

                                            if (!isEnded) {
                                                actions.push({
                                                    label: "Regenerar tickets",
                                                    customRender: (
                                                        <RegenerateTicketsButton raffleId={r.id} />
                                                    ),
                                                });
 
                                                actions.push({
                                                    label: "Editar",
                                                    customRender: (
                                                        <EditRaffleDialog
                                                            raffle={r}
                                                            onSave={(updated) =>
                                                                updateRaffle(r.id, updated)
                                                            }
                                                        />
                                                    ),
                                                });
 
                                                if (r.status === "pending" && !expired) {
                                                    actions.push({
                                                        label: "Activar",
                                                        customRender: (
                                                            <ConfirmDialog
                                                                title="Activar rifa"
                                                                variant="ghost"
                                                                description="¿Seguro que deseas activar esta rifa?"
                                                                triggerLabel="Activar"
                                                                onConfirm={() => activateRaffle(r.id)}
                                                            />
                                                        ),
                                                    });
                                                }
 
                                                if (r.status === "pending" && expired) {
                                                    actions.push({
                                                        label: "Fecha vencida",
                                                        disabled: true,
                                                    });
                                                }
 
                                                if (r.status === "active") {
                                                    actions.push({
                                                        label: "Desactivar",
                                                        customRender: (
                                                            <ConfirmDialog
                                                                title="Desactivar rifa"
                                                                description="¿Seguro que deseas desactivar esta rifa?"
                                                                triggerLabel="Desactivar"
                                                                variant="ghost"
                                                                onConfirm={() =>
                                                                    deactivateRaffle(r.id)
                                                                }
                                                            />
                                                        ),
                                                    });
                                                }
                                            }

                                            return (
                                                <motion.tr
                                                    key={r.id}
                                                    variants={rowVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    transition={{ duration: 0.25 }}
                                                    layout
                                                    className="border-t"
                                                >
                                                    <td className="px-4 py-2">{r.title}</td>
                                                    <td className="px-4 py-2">{r.total_numbers}</td>
                                                    <td className="px-4 py-2">{r.price}</td>
                                                    <td className="px-4 py-2">{r.digits}</td>
                                                    <td className="px-4 py-2">{r.status}</td>
                                                    <td className="px-4 py-2">
                                                        {new Date(r.end_date).toLocaleDateString()}
                                                    </td>

                                                    <td className="px-4 py-2 text-right">
                                                        <TableActionsDropdown actions={actions} />
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </motion.tbody>
                            </table>
                        </div>

                        <div className="flex justify-center mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                setCurrentPage(Math.max(1, currentPage - 1))
                                            }
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                isActive={currentPage === i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setCurrentPage(
                                                    Math.min(totalPages, currentPage + 1)
                                                )
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};