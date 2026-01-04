"use client";

import { Lock } from "lucide-react";

const AdminMobileBlocked = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black px-6 sm:hidden">
      <div className="max-w-md text-center rounded-2xl border border-yellow-500/30 bg-black/70 p-8 shadow-2xl">
        
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/10">
          <Lock className="h-6 w-6 text-yellow-400" />
        </div>

        <h1 className="mb-2 text-xl font-semibold text-yellow-400 tracking-wide">
          Acceso restringido
        </h1>

        <p className="text-sm text-gray-300 leading-relaxed">
          El panel de administración no está disponible en dispositivos móviles.
          <br />
          Para una experiencia óptima y segura, accede desde un computador.
        </p>

        <div className="mt-6 text-xs uppercase tracking-widest text-yellow-500/70">
          Admin Panel · Premium Access
        </div>
      </div>
    </div>
  );
};

export default AdminMobileBlocked;
