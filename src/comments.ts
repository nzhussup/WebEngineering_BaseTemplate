import { requireElement } from './dom.ts';

function createComment(name: string, comment: string): HTMLLIElement {
  const listItem = document.createElement('li');
  const namePara = document.createElement('p');
  const commentPara = document.createElement('p');
  namePara.textContent = name;
  commentPara.textContent = comment;
  listItem.append(namePara, commentPara);
  return listItem;
}

export function initComments(root: ParentNode = document): void {
  const toggleButton = requireElement('.show-hide', HTMLButtonElement, root);
  const commentWrapper = requireElement(
    '.comment-wrapper',
    HTMLDivElement,
    root
  );
  const form = requireElement('.comment-form', HTMLFormElement, root);
  const nameField = requireElement('[name="name"]', HTMLInputElement, form);
  const commentField = requireElement(
    '[name="comment"]',
    HTMLInputElement,
    form
  );
  const list = requireElement('.comment-container', HTMLUListElement, root);

  toggleButton.addEventListener('click', () => {
    commentWrapper.hidden = !commentWrapper.hidden;
    toggleButton.textContent = commentWrapper.hidden
      ? 'Show comments'
      : 'Hide comments';
    toggleButton.setAttribute('aria-expanded', String(!commentWrapper.hidden));
  });

  [nameField, commentField].forEach((field) => {
    field.addEventListener('input', () => {
      field.setCustomValidity('');
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameField.value.trim();
    const comment = commentField.value.trim();
    nameField.setCustomValidity(name !== '' ? '' : 'Enter your name.');
    commentField.setCustomValidity(comment !== '' ? '' : 'Enter a comment.');
    if (!form.reportValidity()) return;

    list.append(createComment(name, comment));
    form.reset();
  });
}
