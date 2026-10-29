import type { Bear } from '../../types.ts';

export function getBearId(bear: Pick<Bear, 'binomial' | 'name'>): string {
  const source = bear.binomial === '' ? bear.name : bear.binomial;
  return source
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
