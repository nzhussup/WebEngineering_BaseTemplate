import { useEffect, useRef, useState } from 'react';
import { extractBears } from '../../bears.ts';
import { fetchBearWikitext, fetchImageUrl } from '../../wikipedia.ts';
import type { BearView } from './BearCard.tsx';

export type BearLoadState =
  | { readonly status: 'loading' }
  | { readonly status: 'empty' }
  | { readonly status: 'error'; readonly message: string }
  | { readonly status: 'success'; readonly bears: readonly BearView[] };

export function useBears(): { state: BearLoadState; reload: () => void } {
  const [state, setState] = useState<BearLoadState>({ status: 'loading' });
  const [request, setRequest] = useState(0);
  const currentRequest = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    currentRequest.current = controller;
    let active = true;
    const isCurrent = (): boolean => active && !controller.signal.aborted;
    setState({ status: 'loading' });
    async function load(): Promise<void> {
      try {
        const data = extractBears(await fetchBearWikitext(controller.signal));
        if (!isCurrent()) return;
        if (data.length === 0) {
          setState({ status: 'empty' });
          return;
        }
        const bears = await Promise.all(
          data.map(async (bear): Promise<BearView> => {
            try {
              const imageUrl =
                bear.fileName === ''
                  ? null
                  : await fetchImageUrl(bear.fileName, controller.signal);
              return { ...bear, imageUrl, imageError: false };
            } catch (error) {
              if (!isCurrent()) throw error;
              console.error('Image lookup failed:', error);
              return { ...bear, imageUrl: null, imageError: true };
            }
          })
        );
        if (isCurrent()) setState({ status: 'success', bears });
      } catch (error) {
        if (!isCurrent()) return;
        console.error('Bear list could not be loaded:', error);
        setState({
          status: 'error',
          message:
            'Could not load bear information from Wikipedia. Check your connection and try again.',
        });
      }
    }
    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [request]);
  function reload(): void {
    currentRequest.current?.abort();
    setState({ status: 'loading' });
    setRequest((previous) => previous + 1);
  }
  return { state, reload };
}
