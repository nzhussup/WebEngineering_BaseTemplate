export var placeholder = './media/bear-placeholder.svg';

export function loadImage(image, url) {
  return new Promise(function(resolve, reject) {
    var timer = setTimeout(function() {
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

export function initImages() {
  document.querySelectorAll('article img').forEach(function(image) {
    var description = image.alt;
    loadImage(image, image.src).catch(function(error) {
      console.error('Article image failed:', error);
      showPlaceholder(image, description);
      var message = document.createElement('p');
      message.setAttribute('role', 'status');
      message.textContent = 'This image could not be loaded. A placeholder is shown.';
      image.after(message);
    });
  });
}
