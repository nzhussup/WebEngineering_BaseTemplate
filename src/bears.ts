import type { Bear, BearCard } from './types.ts';
import { requireElement } from './dom.ts';
import { fetchImageUrl, fetchBearWikitext } from './wikipedia.ts';
import { loadImage, showPlaceholder, showImageError } from './images.ts';

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

function createBearCard(bear: Bear): BearCard {
  const card = document.createElement('div');
  card.className = 'bear';
  const image = document.createElement('img');
  showPlaceholder(image, bear.name);
  image.width = 200;
  const description = document.createElement('p');
  const name = document.createElement('b');
  name.textContent = bear.name;
  description.append(name, ' (' + bear.binomial + ')');
  const range = document.createElement('p');
  range.textContent = 'Range: ' + bear.range;
  card.append(image, description, range);
  return { bear, card, image };
}

async function loadBearImage(
  bear: Bear,
  image: HTMLImageElement
): Promise<boolean> {
  try {
    if (bear.fileName === '') return false;
    const url = await fetchImageUrl(bear.fileName);
    if (url === null) return false;
    await loadImage(image, url);
    image.alt = 'Image of ' + bear.name;
    return false;
  } catch (error) {
    console.error('Image failed for ' + bear.name + ':', error);
    showImageError(image, bear.name);
    return true;
  }
}

export async function initBears(): Promise<void> {
  const status = requireElement('.bear-status', HTMLParagraphElement);
  const list = requireElement('.bear-list', HTMLDivElement);
  status.textContent = 'Loading bears…';
  list.replaceChildren();
  try {
    const wikitext = await fetchBearWikitext();
    const bears = extractBears(wikitext);
    // Create every card in source order before any image requests finish.
    const entries = bears.map(createBearCard);
    const fragment = document.createDocumentFragment();
    entries.forEach(({ card }) => {
      fragment.append(card);
    });
    list.replaceChildren(fragment);
    status.textContent = 'Bear information loaded. Loading images…';
    const imageFailures = await Promise.all(
      entries.map(async ({ bear, image }) => await loadBearImage(bear, image))
    );
    const failedImages = imageFailures.filter(Boolean).length;
    status.textContent =
      failedImages > 0
        ? 'Bear information loaded, but ' +
          failedImages +
          ' image(s) could not be loaded. Placeholders are shown. Reload the page to try again.'
        : '';
  } catch (error) {
    console.error('Bear list could not be loaded:', error);
    list.replaceChildren();
    status.textContent =
      'Could not load bear information from Wikipedia. Check your connection and reload the page. If the problem continues, Wikipedia may be unavailable or its page format may have changed.';
  }
}
