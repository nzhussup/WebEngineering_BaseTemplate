import placeholder from '../media/bear-placeholder.svg?url';

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

export function showPlaceholder(image: HTMLImageElement, name: string): void {
  // The failed image's listeners have been removed, so fallback cannot loop.
  image.src = placeholder;
  image.alt = 'No image available for ' + name;
}

export function showImageError(
  image: HTMLImageElement,
  description: string
): void {
  showPlaceholder(image, description);
  const message = document.createElement('p');
  message.setAttribute('role', 'status');
  message.textContent = 'Image could not be loaded. A placeholder is shown.';
  image.after(message);
}

export async function initImages(): Promise<void> {
  await Promise.all(
    Array.from(
      document.querySelectorAll<HTMLImageElement>('article img'),
      async (image) => {
        const description = image.alt;
        try {
          await loadImage(image, image.src);
        } catch (error) {
          console.error('Article image failed:', error);
          showImageError(image, description);
        }
      }
    )
  );
}
