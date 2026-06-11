/** Format a measured value like the design: integers plain, otherwise one decimal. */
export function fmt(value: number): string {
  return Number.isInteger(value) ? String(value) : (Math.round(value * 10) / 10).toFixed(1);
}

/** Up to two initials from a full name, e.g. "Lena Brandt" → "LB". */
export function initials(name: string): string {
  return (
    (name || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('') || '?'
  );
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}
