"use client";
import { useEffect, useState } from "react";

/**
 * Hook reutilizable para mostrar una pantalla de carga.
 * @param duration Tiempo en milisegundos que dura el loading (por defecto 1000 ms)
 */
export function useLoadingScreen(duration: number = 1000) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return loading;
}
