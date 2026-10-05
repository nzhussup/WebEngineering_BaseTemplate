const baseUrl = 'https://en.wikipedia.org/w/api.php';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function requestWikipedia(
  params: Record<string, string>,
  signal?: AbortSignal
): Promise<Record<string, unknown>> {
  const url =
    baseUrl +
    '?' +
    new URLSearchParams({ format: 'json', origin: '*', ...params }).toString();
  const controller = new AbortController();
  const abort = (): void => {
    controller.abort();
  };
  if (signal?.aborted === true) controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => {
    controller.abort(
      new DOMException('Wikipedia request timed out.', 'TimeoutError')
    );
  }, 15000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(
        'Wikipedia request failed (HTTP ' + response.status + ').'
      );
    }
    const data: unknown = await response.json();
    if (!isRecord(data)) {
      throw new Error('Wikipedia returned an invalid response.');
    }
    if ('error' in data) {
      const error = data.error;
      const detail =
        isRecord(error) && typeof error.info === 'string'
          ? error.info
          : 'unknown error';
      throw new Error('Wikipedia API error: ' + detail);
    }
    return data;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

export async function fetchImageUrl(
  fileName: string,
  signal?: AbortSignal
): Promise<string | null> {
  const data = await requestWikipedia(
    {
      action: 'query',
      titles: 'File:' + fileName,
      prop: 'imageinfo',
      iiprop: 'url',
      redirects: '1',
    },
    signal
  );
  const pages = isRecord(data.query) ? data.query.pages : undefined;
  if (!isRecord(pages) || Object.keys(pages).length !== 1) {
    throw new Error(
      'Wikipedia returned invalid image data for ' + fileName + '.'
    );
  }
  const page = Object.values(pages)[0];
  if (!isRecord(page)) {
    throw new Error('Wikipedia returned an invalid image page.');
  }
  // Missing data is different from malformed data or a failed request.
  if (!('imageinfo' in page) && page.missing === '') return null;
  const info: unknown = Array.isArray(page.imageinfo)
    ? page.imageinfo[0]
    : undefined;
  if (!isRecord(info) || typeof info.url !== 'string') {
    throw new Error(
      'Wikipedia returned an invalid image URL for ' + fileName + '.'
    );
  }
  const url = new URL(info.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Wikipedia returned an unsupported image URL.');
  }
  return url.href;
}

export async function fetchBearWikitext(signal?: AbortSignal): Promise<string> {
  const data = await requestWikipedia(
    {
      action: 'parse',
      page: 'List_of_ursids',
      prop: 'wikitext',
    },
    signal
  );
  const parse = data.parse;
  const text = isRecord(parse) ? parse.wikitext : undefined;
  const wikitext = isRecord(text) ? text['*'] : undefined;
  if (typeof wikitext !== 'string' || wikitext.trim() === '') {
    throw new Error('Wikipedia returned missing or empty bear text.');
  }
  return wikitext;
}
