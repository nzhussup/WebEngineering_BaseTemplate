export async function loadImage(
  image: HTMLImageElement,
  url: string
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      finish(new Error('Image loading timed out: ' + url));
    }, 15000);

    function finish(error: Error | null): void {
      clearTimeout(timer);
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

    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.src = url;
  });
}
