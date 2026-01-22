"use client";

export default function RaffleLegend() {
  return (
    <div className="flex gap-8 text-sm text-white/80 items-center justify-center my-10">

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border border-gold" />
        <span>Disponible</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-white/20 border border-white/40" />
        <span>Reservado</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-700/60 border border-red-500" />
        <span>Comprado</span>
      </div>

    </div>
  );
}
