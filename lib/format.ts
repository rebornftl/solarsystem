export function formatNumber(n: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
    ...opts,
  }).format(n);
}

export function formatDistance(km: number): string {
  if (km === 0) return "—";
  if (km >= 1_000_000) return `${formatNumber(km / 1_000_000)} млн км`;
  return `${formatNumber(km)} км`;
}

export function formatMass(kg: number): string {
  if (kg === 0) return "—";
  const exp = Math.floor(Math.log10(kg));
  const base = kg / Math.pow(10, exp);
  return `${base.toFixed(2)} × 10^${exp} кг`;
}

export function formatTemperature(c: number): string {
  return `${c > 0 ? "+" : ""}${formatNumber(c)} °C`;
}

/** Russian plural rules (one / few / many). */
function pluralize(n: number, forms: [one: string, few: string, many: string]): string {
  const abs = Math.abs(n) % 100;
  const mod10 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (mod10 > 1 && mod10 < 5) return forms[1];
  if (mod10 === 1) return forms[0];
  return forms[2];
}

export function formatDuration(hours: number): string {
  if (hours === 0) return "—";
  if (hours < 48) return `${formatNumber(hours)} ч`;
  const days = hours / 24;
  if (days < 365) return `${formatNumber(days)} ${pluralize(Math.round(days), ["сутки", "суток", "суток"])}`;
  const years = days / 365.25;
  return `${formatNumber(years)} ${pluralize(Math.round(years), ["год", "года", "лет"])}`;
}

export function formatYearLength(days: number): string {
  if (days === 0) return "—";
  if (days < 365) {
    const rounded = Math.round(days);
    return `${formatNumber(days)} ${pluralize(rounded, ["день", "дня", "дней"])}`;
  }
  const years = days / 365.25;
  const rounded = Math.round(years);
  return `${formatNumber(years)} ${pluralize(rounded, ["год", "года", "лет"])}`;
}
