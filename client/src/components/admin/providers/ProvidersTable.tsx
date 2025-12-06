"use client";

import { Button } from "@/components/ui/button";
import { Providers } from "@/type/Providers";

interface ProvidersTableProps {
  providers: Providers[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ProvidersTable({ providers, onEdit, onDelete }: ProvidersTableProps) {
  if (providers.length === 0) {
    return <p>No hay proveedores registrados.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Contacto</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Tel</th>
            <th className="px-4 py-2 text-left">Opciones</th>
          </tr>
        </thead>

        <tbody>
          {providers.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.contact_name}</td>
              <td className="px-4 py-2">{p.contact_email}</td>
              <td className="px-4 py-2">{p.contact_phone}</td>

              <td className="px-4 py-2">
                <div className="flex items-center gap-3">
                  <Button className="bg-green-500" onClick={() => onEdit(p.id!)}>
                    Editar
                  </Button>

                  <Button className="bg-red-500" onClick={() => onDelete(p.id!)}>
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
