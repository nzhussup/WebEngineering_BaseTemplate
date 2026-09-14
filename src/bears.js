import { fetchImageUrl, fetchBearWikitext } from './wikipedia.js';

import { loadImage, showPlaceholder } from './images.js';

function readField(row, field) {
  // A field ends at the next named parameter, not at a pipe inside a wiki link.
  var match = row.match(new RegExp('\\|\\s*' + field + '\\s*=([\\s\\S]*?)(?=\\|\\s*[\\w-]+\\s*=|$)'));
  return match ? match[1].trim() : '';
}

function plainText(value) {
  return value
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<ref\b[^>]*\/>|<ref\b[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'{2,3}/g, '')
    .trim();
}

export function extractBears(wikitext) {
  var bears = [];
  var seen = new Set();
  wikitext.split(/\{\{Species table\/row\s*/i).slice(1).forEach(function(row) {
    var name = plainText(readField(row, 'name'));
    var binomial = plainText(readField(row, 'binomial'));
    if (!name || !binomial || !plainText(readField(row, 'range'))) {
      throw new Error('A Wikipedia species row is missing its name, scientific name, or range.');
    }
    if (seen.has(binomial)) return;
    seen.add(binomial);
    bears.push({
      name: name,
      binomial: binomial,
      fileName: readField(row, 'image').replace(/^File:/i, ''),
      range: plainText(readField(row, 'range'))
    });
  });
  if (bears.length === 0) {
    throw new Error('No species rows found; the Wikipedia page format may have changed.');
  }
  return bears;
}

function renderBear(bear) {
  var card = document.createElement('div');
  card.className = 'bear';
  var image = document.createElement('img');
  showPlaceholder(image, bear.name);
  image.width = 200;
  var description = document.createElement('p');
  var name = document.createElement('b');
  name.textContent = bear.name;
  description.append(name, ' (' + bear.binomial + ')');
  var range = document.createElement('p');
  range.textContent = 'Range: ' + bear.range;
  card.append(image, description, range);
  document.querySelector('.bear-list').append(card);
  return image;
}

async function loadBearImage(bear, image) {
  try {
    if (!bear.fileName) return false;
    var url = await fetchImageUrl(bear.fileName);
    if (!url) return false;
    await loadImage(image, url);
    image.alt = 'Image of ' + bear.name;
    return false;
  } catch (error) {
    console.error('Image failed for ' + bear.name + ':', error);
    showPlaceholder(image, bear.name);
    var message = document.createElement('p');
    message.textContent = 'Image could not be loaded. A placeholder is shown.';
    image.after(message);
    return true;
  }
}

export async function initBears() {
  var status = document.querySelector('.bear-status');
  var list = document.querySelector('.bear-list');
  status.textContent = 'Loading bears…';
  list.replaceChildren();
  try {
    var wikitext = await fetchBearWikitext();
    var bears = extractBears(wikitext);
    // Create every card in source order before any image requests finish.
    var images = bears.map(renderBear);
    status.textContent = 'Bear information loaded. Loading images…';
    var failedImages = 0;
    await bears.reduce(function(previous, bear, index) {
      return previous.then(function() {
        return loadBearImage(bear, images[index]);
      }).then(function(failed) {
        if (failed) failedImages += 1;
      });
    }, Promise.resolve());
    status.textContent = failedImages
      ? 'Bear information loaded, but ' + failedImages + ' image(s) could not be loaded. Placeholders are shown. Reload the page to try again.'
      : '';
  } catch (error) {
    console.error('Bear list could not be loaded:', error);
    list.replaceChildren();
    status.textContent = 'Could not load bear information from Wikipedia. Check your connection and reload the page. If the problem continues, Wikipedia may be unavailable or its page format may have changed.';
  }
}
