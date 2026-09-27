import { initImages } from './images.ts';
import { initSearch } from './search.ts';
import { initComments } from './comments.ts';
import { initBears } from './bears.ts';

try {
  initSearch();
  initComments();
  await Promise.all([initImages(), initBears()]);
} catch (error) {
  console.error('Application startup failed:', error);
  const message = document.createElement('p');
  message.setAttribute('role', 'alert');
  message.textContent = 'The page could not start correctly. Please reload it.';
  document.body.prepend(message);
}
