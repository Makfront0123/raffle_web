"use client";

import { useState } from "react";
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
import { AuthStore } from "@/store/authStore";
import { usePrizes } from "@/hook/usePrizes";

const ITEMS_PER_PAGE = 5;

export function PrizesTable({ prizes }: { prizes: any[] }) {
  const [page, setPage] = useState(1);
  const { token } = AuthStore();
  const { deletePrize, updatePrize } = usePrizes();

  const totalPages = Math.ceil(prizes.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const visiblePrizes = prizes.slice(start, end);

  // Estado del modal
  const [selectedPrize, setSelectedPrize] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (prize: any) => {
    setSelectedPrize(prize);
    setIsEditOpen(true);
  };

  const handleDelete = (prize: any) => {
    setSelectedPrize(prize);
    setIsDeleteOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Premios Existentes</CardTitle>
      </CardHeader>
      <CardContent>
        {prizes.length === 0 ? (
          <p>No hay premios registrados.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200">
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
                  {visiblePrizes.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.description}</td>
                      <td className="px-4 py-2">${p.value}</td>
                      <td className="px-4 py-2">{p.raffle?.title ?? "Sin rifa"}</td>
                      <td className="px-4 py-2">{p.provider?.name ?? "Sin proveedor"}</td>
                      <td className="px-4 py-2 flex items-center gap-3">
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(p)}
                        >
                          Eliminar
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleEdit(p)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- Paginador --- */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <p>Página {page} de {totalPages}</p>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </CardContent>

      {/* --- Modal Editar --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Premio</DialogTitle>
            <DialogDescription>
              Actualiza los datos del premio seleccionado.
            </DialogDescription>
          </DialogHeader>

          {selectedPrize && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePrize(selectedPrize.id, selectedPrize, token ?? "");
                setIsEditOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <Label>Nombre</Label>
                <Input
                  value={selectedPrize.name}
                  onChange={(e) =>
                    setSelectedPrize({ ...selectedPrize, name: e.target.value })
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
                      value: parseFloat(e.target.value),
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

      {/* --- Modal Eliminar --- */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar el premio "{selectedPrize?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deletePrize(selectedPrize?.id);
                setIsDeleteOpen(false);
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
