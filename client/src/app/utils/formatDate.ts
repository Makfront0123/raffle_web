export interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calcula el tiempo restante de forma segura en UTC
 */
export function getTimeRemaining(expireDate: string | Date): TimeRemaining {
  // Convierte la fecha a timestamp en milisegundos UTC
  const total = new Date(expireDate).getTime() - Date.now();

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}
/**
 * Formatea el tiempo restante para mostrarlo bonito
 */
export function formatCountdown(time: TimeRemaining) {
  const { days, hours, minutes, seconds, total } = time;
  if (total <= 0) return "Expirada";
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
