import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PremiumFooter() {
  return (
    <footer className=" w-full bg-black/90 border-t py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-300">
        <div>
          <h3 className="text-gold font-semibold text-lg mb-3">Rifas Premium</h3>
          <p className="text-sm">La mejor plataforma de rifas digitales con transparencia y premios reales.</p>
        </div>

        <div>
          <h3 className="text-gold font-semibold text-lg mb-3">Enlaces</h3>
          <ul className="space-y-2 text-sm [&>li:hover]:opacity-80 flex flex-col gap-y-1">
            <Link href="/raffles">
              <li className="cursor-pointer">Rifas</li>
            </Link>
            <Link href="/">
              <li className="cursor-pointer">Ganadores</li>
            </Link>
            <Link href="/">
              <li className="cursor-pointer">Preguntas frecuentes</li>
            </Link>
          </ul>
        </div>

        <div>
          <h3 className="text-gold font-semibold text-lg mb-3">Contacto</h3>
          <p className="text-sm">📩 soporte@rifaspremium.com</p>
          <p className="text-sm">📱 +57 300 000 0000</p>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-10">
        © {new Date().getFullYear()} Rifas Premium — Todos los derechos reservados.
      </p>
    </footer>
  );
}
