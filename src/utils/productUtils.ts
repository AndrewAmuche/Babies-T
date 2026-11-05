import { Product } from '../types';

/**
 * Extracts a concise, lowercase age range tag for a product (e.g. "1–8 yrs", "2–9 yrs").
 * Designed to fit elegantly in small letter format at the top of product images.
 */
export function getProductAgeRange(product: Product): string {
  if (!product) return '1–8 yrs';

  const raw = product.dimensions || '';

  // Shoes category sizing
  if (product.category === 'Shoes' || raw.toLowerCase().includes('eu')) {
    if (raw.includes('19') || raw.includes('21')) return '1–5 yrs';
    return '1–6 yrs';
  }

  // Parse age patterns like "1-2 Years ... 7-8 Years" or "2-3Y, 4-5Y, 6-7Y, 8-9Y"
  const numbers: number[] = [];
  raw.replace(/\b(\d+)\s*(?:-|–)\s*(\d+)\s*(?:Years|Y|yrs)?/gi, (_, n1, n2) => {
    const p1 = parseInt(n1, 10);
    const p2 = parseInt(n2, 10);
    if (!isNaN(p1) && p1 >= 1 && p1 <= 16) numbers.push(p1);
    if (!isNaN(p2) && p2 >= 1 && p2 <= 16) numbers.push(p2);
    return '';
  });

  if (numbers.length >= 2) {
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    return `${min}–${max} yrs`;
  }

  // Fallback single digit scans
  const digits = raw.match(/\b\d+\b/g)?.map(Number).filter((n) => n >= 1 && n <= 16) || [];
  if (digits.length >= 2) {
    const min = Math.min(...digits);
    const max = Math.max(...digits);
    return `${min}–${max} yrs`;
  }

  // Fallback defaults
  if (product.category === 'Shoes') return '1–5 yrs';
  return '1–8 yrs';
}
