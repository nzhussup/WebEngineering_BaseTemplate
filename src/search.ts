import { requireElement } from './dom.ts';

function clearHighlights(article: HTMLElement): void {
  article.querySelectorAll('mark.highlight').forEach((mark) => {
    const parent = mark.parentNode;
    mark.replaceWith(document.createTextNode(mark.textContent ?? ''));
    parent?.normalize();
  });
}

function collectTextNodes(article: HTMLElement): Text[] {
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest('script, style, form, button') != null
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  // Snapshot before replacing nodes so tree changes cannot skip matches.
  const textNodes: Text[] = [];
  while (walker.nextNode() !== null) {
    if (walker.currentNode instanceof Text) textNodes.push(walker.currentNode);
  }
  return textNodes;
}

function highlightText(node: Text, regex: RegExp): void {
  const fragment = document.createDocumentFragment();
  let position = 0;
  for (const match of node.data.matchAll(regex)) {
    if (match.index === undefined) continue;
    fragment.append(
      document.createTextNode(node.data.slice(position, match.index))
    );
    const mark = document.createElement('mark');
    mark.className = 'highlight';
    mark.textContent = match[0];
    fragment.append(mark);
    position = match.index + match[0].length;
  }
  if (position === 0) return;
  fragment.append(document.createTextNode(node.data.slice(position)));
  node.replaceWith(fragment);
}

export function initSearch(): void {
  const form = requireElement('.search', HTMLFormElement);
  const queryField = requireElement('[name="q"]', HTMLInputElement, form);
  const articles = document.querySelectorAll('article');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchKey = queryField.value.trim();
    const regex = new RegExp(
      searchKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'gi'
    );
    articles.forEach((article) => {
      clearHighlights(article);
      if (searchKey === '') return;
      collectTextNodes(article).forEach((node) => {
        highlightText(node, regex);
      });
    });
  });
}
