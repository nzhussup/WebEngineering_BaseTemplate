import { fetchImageUrl, fetchBearWikitext } from './wikipedia.js';

var placeholder = './media/bear-placeholder.svg';

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
    if (!name || !binomial || seen.has(binomial)) return;
    seen.add(binomial);
    bears.push({
      name: name,
      binomial: binomial,
      fileName: readField(row, 'image').replace(/^File:/i, ''),
      range: plainText(readField(row, 'range'))
    });
  });
  return bears;
}

function renderBear(bear) {
  var card = document.createElement('div');
  card.className = 'bear';
  var image = document.createElement('img');
  image.src = placeholder;
  image.alt = 'No image available for ' + bear.name;
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

export function initBears() {
  return fetchBearWikitext().then(function(wikitext) {
    var bears = extractBears(wikitext);
    document.querySelector('.bear-list').replaceChildren();
    // Create every card in source order before any image requests finish.
    var images = bears.map(renderBear);
    return bears.reduce(function(previous, bear, index) {
      return previous.then(function() {
        if (!bear.fileName) return;
        return fetchImageUrl(bear.fileName).then(function(url) {
          if (url) {
            images[index].src = url;
            images[index].alt = 'Image of ' + bear.name;
          }
        });
      });
    }, Promise.resolve());
  });
}
