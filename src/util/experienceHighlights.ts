// Keep hiring summaries grounded in the YAML while exposing production responsibility.
export function experienceHighlights(company: string, role: string, descriptions: string[]): string[] {
  const indexes = company === 'Visa Inc' && role === 'Software Engineer' ? [0, 1, 3] : [0, 1];
  return indexes.map(index => descriptions[index]).filter(Boolean);
}
