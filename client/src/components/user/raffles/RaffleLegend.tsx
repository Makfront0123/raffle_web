export default function RaffleLegend() {
  return (
    <div className="flex gap-6 text-sm text-black items-center justify-center my-6">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-green-200 border border-green-400" />
        <span>Disponible</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-blue-200 border border-blue-400" />
        <span>Reservado</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-200 border border-red-400" />
        <span>Comprado</span>
      </div>
    </div>
  );
}
