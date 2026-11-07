// Small helpers for route points. UI state keeps X/Y/H as strings (TextInput
// values); the API uses numbers. Convert with fromApiPoints / toApiPoints.

// 0 -> "A", 1 -> "B", ... 25 -> "Z", 26 -> "AA"
export function labelForIndex(index) {
  let n = index;
  let label = '';
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

export function createPoint(index, x = 0, y = 0, h = 0) {
  return {
    id: `p-${Date.now()}-${index}`,
    label: labelForIndex(index),
    x: String(x),
    y: String(y),
    h: String(h),
  };
}

// "12.5" -> 12.5, "" or "abc" -> null
export function toNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export function fromApiPoints(apiPoints = []) {
  return apiPoints.map((p, i) => ({
    id: p.id ?? `p-${i}`,
    label: p.label ?? labelForIndex(i),
    x: String(p.x ?? 0),
    y: String(p.y ?? 0),
    h: String(p.h ?? 0),
  }));
}

export function toApiPoints(points = []) {
  return points.map((p) => ({
    id: p.id,
    label: p.label,
    x: toNumber(p.x) ?? 0,
    y: toNumber(p.y) ?? 0,
    h: toNumber(p.h) ?? 0,
  }));
}
