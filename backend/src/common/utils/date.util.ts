// Utilidades de fecha simples (formato 'YYYY-MM-DD') para no sumar
// una dependencia externa solo para esto.

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(dateISO: string, days: number): string {
  const date = new Date(`${dateISO}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isBeforeToday(dateISO: string): boolean {
  return dateISO < todayISO();
}

export function laterISO(a: string, b: string): string {
  return a > b ? a : b;
}
