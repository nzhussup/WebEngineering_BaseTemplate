import type { Bear } from './types.ts';

function readField(row: string, field: string): string {
  // A field ends at the next named parameter, not at a pipe inside a wiki link.
  const match = row.match(
    new RegExp('\\|\\s*' + field + '\\s*=([\\s\\S]*?)(?=\\|\\s*[\\w-]+\\s*=|$)')
  );
  return match?.[1]?.trim() ?? '';
}

function plainText(value: string): string {
  return value
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<ref\b[^>]*\/>|<ref\b[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'{2,3}/g, '')
    .trim();
}

export function extractBears(wikitext: string): Bear[] {
  const bears: Bear[] = [];
  const seen = new Set<string>();
  wikitext
    .split(/\{\{Species table\/row\s*/i)
    .slice(1)
    .forEach((row) => {
      const name = plainText(readField(row, 'name'));
      const binomial = plainText(readField(row, 'binomial'));
      const range = plainText(readField(row, 'range'));
      if (name === '' || binomial === '' || range === '') {
        throw new Error(
          'A Wikipedia species row is missing its name, scientific name, or range.'
        );
      }
      if (seen.has(binomial)) return;
      seen.add(binomial);
      bears.push({
        name,
        binomial,
        fileName: readField(row, 'image').replace(/^File:/i, ''),
        range,
      });
    });
  if (bears.length === 0) {
    throw new Error(
      'No species rows found; the Wikipedia page format may have changed.'
    );
  }
  return bears;
}
