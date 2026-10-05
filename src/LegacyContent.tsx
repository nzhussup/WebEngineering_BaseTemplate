import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import markup from './legacy.html?raw';
import wildBear from '../media/wild-bear.jpg';
import urbanBear from '../media/urban-bear.jpg';
import bearMp3 from '../media/bear.mp3';
import bearOgg from '../media/bear.ogg';
import { initImages } from './images.ts';
import { initSearch } from './search.ts';
import { initComments } from './comments.ts';
import { initBears } from './bears.ts';

const assets: Record<string, string> = {
  'media/wild-bear.jpg': wildBear,
  'media/urban-bear.jpg': urbanBear,
  'media/bear.mp3': bearMp3,
  'media/bear.ogg': bearOgg,
};

export function LegacyContent(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;
    let active = true;

    // Trusted local template, never user/API HTML. React renders no children here.
    const template = document.createElement('template');
    template.innerHTML = markup;
    template.content.querySelectorAll('[src]').forEach((element) => {
      const url = assets[element.getAttribute('src') ?? ''];
      if (url !== undefined) element.setAttribute('src', url);
    });
    container.replaceChildren(template.content);

    async function initialize(host: HTMLDivElement): Promise<void> {
      try {
        initSearch(host);
        initComments(host);
        await Promise.all([initImages(host), initBears(host)]);
      } catch (error) {
        console.error('Application startup failed:', error);
        if (!active) return;
        const message = document.createElement('p');
        message.setAttribute('role', 'alert');
        message.textContent =
          'The page could not start correctly. Please reload it.';
        host.prepend(message);
      }
    }

    void initialize(container);
    return () => {
      active = false;
      container.replaceChildren();
    };
  }, []);

  // This empty host is the boundary between React and the temporary legacy UI.
  return <div ref={containerRef} />;
}
