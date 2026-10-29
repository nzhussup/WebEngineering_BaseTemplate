export async function loadImage(
  image: HTMLImageElement,
  url: string,
  signal?: AbortSignal
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted === true) {
      reject(new DOMException('Image loading cancelled.', 'AbortError'));
      return;
    }
    let settled = false;
    const timer = setTimeout(() => {
      finish(new Error('Image loading timed out: ' + url));
    }, 15000);

    function finish(error: Error | null): void {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
      if (error !== null) reject(error);
      else resolve();
    }

    function onLoad(): void {
      finish(
        image.naturalWidth > 0 ? null : new Error('Image is empty: ' + url)
      );
    }

    function onError(): void {
      finish(new Error('Could not load image: ' + url));
    }

    function onAbort(): void {
      finish(new DOMException('Image loading cancelled.', 'AbortError'));
      image.removeAttribute('src');
    }

    signal?.addEventListener('abort', onAbort, { once: true });
    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.src = url;
  });
}
