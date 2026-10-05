import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { extractBears } from '../../bears.ts';
import { fetchBearWikitext, fetchImageUrl } from '../../wikipedia.ts';
import { BearList } from './BearCard.tsx';
import type { BearView } from './BearCard.tsx';
import { Highlight } from '../search/Highlight.tsx';

export function BearsSection({
  query,
}: {
  readonly query: string;
}): ReactElement {
  const [bears, setBears] = useState<readonly BearView[]>([]);
  const [status, setStatus] = useState('Loading bears…');
  useEffect(() => {
    let active = true;
    async function load(): Promise<void> {
      try {
        const data = extractBears(await fetchBearWikitext());
        if (!active) return;
        setBears(
          data.map((bear) => ({ ...bear, imageUrl: null, imageError: false }))
        );
        const resolved = await Promise.all(
          data.map(async (bear): Promise<BearView> => {
            try {
              const imageUrl =
                bear.fileName === ''
                  ? null
                  : await fetchImageUrl(bear.fileName);
              return { ...bear, imageUrl, imageError: false };
            } catch (error) {
              console.error('Image lookup failed:', error);
              return { ...bear, imageUrl: null, imageError: true };
            }
          })
        );
        if (!active) return;
        setBears(resolved);
        setStatus('');
      } catch (error) {
        console.error('Bear list could not be loaded:', error);
        if (active)
          setStatus(
            'Could not load bear information from Wikipedia. Check your connection and reload the page.'
          );
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);
  return (
    <section className="more_bears">
      <h2>
        <Highlight text="More Bears" query={query} />
      </h2>
      <p className="bear-status" role="status" aria-live="polite">
        {status}
      </p>
      <BearList bears={bears} query={query} />
    </section>
  );
}
