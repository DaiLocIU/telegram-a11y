const ISO_FLAGS_OFFSET = 127397;

export function isoToEmoji(iso: string) {
  // Special case for Fragment numbers
  if (iso === 'FT') {
    return '\uD83C\uDFF4\u200D\u2620\uFE0F';
  }

  const code = iso.toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) return iso;
  const codePoints = [...code].map((c) => c.codePointAt(0)! + ISO_FLAGS_OFFSET);
  return String.fromCodePoint(...codePoints);
}
