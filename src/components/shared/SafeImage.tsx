import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import placeholder from '../../../media/bear-placeholder.svg';
import { loadImage } from '../../images.ts';

interface Props {
  readonly src: string | null;
  readonly description: string;
  readonly width?: number;
}
export function SafeImage({ src, description, width }: Props): ReactElement {
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    async function check(): Promise<void> {
      if (src === null) return;
      try {
        await loadImage(new Image(), src);
        if (active) setLoaded(src);
      } catch (error) {
        console.error('Image failed:', error);
        if (active) setFailed(src);
      }
    }
    void check();
    return () => {
      active = false;
    };
  }, [src]);
  const available = src !== null && loaded === src;
  return (
    <>
      <img
        src={available ? src : placeholder}
        alt={available ? description : 'No image available for ' + description}
        width={width}
      />
      {src !== null && failed === src && (
        <p role="status">Image could not be loaded. A placeholder is shown.</p>
      )}
    </>
  );
}
