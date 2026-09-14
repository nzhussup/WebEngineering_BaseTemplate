const baseUrl = 'https://en.wikipedia.org/w/api.php';

async function requestWikipedia(params) {
  const url = baseUrl + '?' + new URLSearchParams({ format: 'json', origin: '*', ...params }).toString();
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    throw new Error('Wikipedia request failed (HTTP ' + response.status + ').');
  }
  const data = await response.json();
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Wikipedia returned an invalid response.');
  }
  if (data.error) {
    throw new Error('Wikipedia API error: ' + (data.error.info || data.error.code || 'unknown error'));
  }
  return data;
}

export async function fetchImageUrl(fileName) {
  const data = await requestWikipedia({
    action: 'query',
    titles: 'File:' + fileName,
    prop: 'imageinfo',
    iiprop: 'url',
    redirects: 1
  });
  const pages = data.query?.pages;
  if (!pages || typeof pages !== 'object' || Array.isArray(pages) || Object.keys(pages).length !== 1) {
    throw new Error('Wikipedia returned invalid image data for ' + fileName + '.');
  }
  const page = Object.values(pages)[0];
  if (!page || typeof page !== 'object') {
    throw new Error('Wikipedia returned an invalid image page.');
  }
  // A missing file is valid absence; a malformed response is a failure.
  if (!page.imageinfo && Object.hasOwn(page, 'missing')) return null;
  const url = page.imageinfo?.[0]?.url;
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    throw new Error('Wikipedia returned an invalid image URL for ' + fileName + '.');
  }
  return url;
}

export async function fetchBearWikitext() {
  const data = await requestWikipedia({
    action: 'parse',
    page: 'List_of_ursids',
    prop: 'wikitext'
  });
  const wikitext = data.parse?.wikitext?.['*'];
  if (typeof wikitext !== 'string' || !wikitext.trim()) {
    throw new Error('Wikipedia returned missing or empty bear text.');
  }
  return wikitext;
}
