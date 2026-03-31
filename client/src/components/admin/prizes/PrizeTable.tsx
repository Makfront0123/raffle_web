"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { Prizes, PrizesTableProps } from "@/type/Prizes";
import { TableActionsDropdown } from "@/components/TableActionsDropdown";

export function PrizesTable({
  prizes,
  raffles,
  selectedRaffle,
  onRaffleChange,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
  onUpdate,
  onDelete,
}: PrizesTableProps) {
  const [selectedPrize, setSelectedPrize] = useState<Prizes | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Premios</CardTitle>
        <Select
          value={String(selectedRaffle)}
          onValueChange={(v) =>
            onRaffleChange(v === "all" ? "all" : Number(v))
          }
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrar por rifa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {raffles.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>
                {r.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {prizes.length === 0 ? (
          <p>No hay premios registrados.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Descripción</th>
                    <th className="px-4 py-2 text-left">Valor</th>
                    <th className="px-4 py-2 text-left">Rifa</th>
                    <th className="px-4 py-2 text-left">Proveedor</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {prizes.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.description}</td>
                      <td className="px-4 py-2">${p.value}</td>
                      <td className="px-4 py-2">{p.raffle?.title}</td>
                      <td className="px-4 py-2">{p.provider?.name}</td>
                      <td className="px-4 py-2 text-right">
                        <TableActionsDropdown
                          actions={[
                            {
                              label: "Editar",
                              onClick: () => {
                                setSelectedPrize(p);
                                setEditOpen(true);
                              },
                            },
                            {
                              label: "Eliminar",
                              destructive: true,
                              onClick: () => {
                                setSelectedPrize(p);
                                setDeleteOpen(true);
                              },
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" disabled={page === 1} onClick={onPrevPage}>
                Anterior
              </Button>
              <p>
                Página {page} de {totalPages}
              </p>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={onNextPage}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar premio</DialogTitle>
            <DialogDescription>
              Actualiza la información del premio
            </DialogDescription>
          </DialogHeader>

          {selectedPrize && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdate(selectedPrize.id, selectedPrize);
                setEditOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <Label>Nombre</Label>
                <Input
                  value={selectedPrize.name}
                  onChange={(e) =>
                    setSelectedPrize({
                      ...selectedPrize,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Input
                  value={selectedPrize.description}
                  onChange={(e) =>
                    setSelectedPrize({
                      ...selectedPrize,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Valor</Label>
                <Input
                  type="number"
                  value={selectedPrize.value}
                  onChange={(e) =>
                    setSelectedPrize({
                      ...selectedPrize,
                      value: Number(e.target.value),
                    })
                  }
                />
              </div>

              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar premio</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar este premio?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            {selectedPrize && (
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(selectedPrize.id);
                  setDeleteOpen(false);
                }}
              >
                Eliminar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
