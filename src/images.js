import placeholder from '../media/bear-placeholder.svg?url';

export function loadImage(image, url) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      finish(new Error('Image loading timed out: ' + url));
    }, 15000);

    function finish(error) {
      clearTimeout(timer);
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
      if (error) reject(error);
      else resolve();
    }

    function onLoad() {
      finish(image.naturalWidth > 0 ? null : new Error('Image is empty: ' + url));
    }

    function onError() {
      finish(new Error('Could not load image: ' + url));
    }

    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.src = url;
  });
}

export function showPlaceholder(image, name) {
  // The failed image's listeners have been removed, so fallback cannot loop.
  image.src = placeholder;
  image.alt = 'No image available for ' + name;
}

export function showImageError(image, description) {
  showPlaceholder(image, description);
  const message = document.createElement('p');
  message.setAttribute('role', 'status');
  message.textContent = 'Image could not be loaded. A placeholder is shown.';
  image.after(message);
}

export async function initImages() {
  await Promise.all(Array.from(document.querySelectorAll('article img'), async (image) => {
    const description = image.alt;
    try {
      await loadImage(image, image.src);
    } catch (error) {
      console.error('Article image failed:', error);
      showImageError(image, description);
    }
  }));
}
