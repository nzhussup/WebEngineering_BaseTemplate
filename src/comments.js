function createComment(name, comment) {
  const listItem = document.createElement('li');
  const namePara = document.createElement('p');
  const commentPara = document.createElement('p');
  namePara.textContent = name;
  commentPara.textContent = comment;
  listItem.append(namePara, commentPara);
  return listItem;
}

export function initComments() {
  const toggleButton = document.querySelector('.show-hide');
  const commentWrapper = document.querySelector('.comment-wrapper');
  const form = document.querySelector('.comment-form');
  const nameField = form.querySelector('[name="name"]');
  const commentField = form.querySelector('[name="comment"]');
  const list = document.querySelector('.comment-container');

  toggleButton.addEventListener('click', () => {
    commentWrapper.hidden = !commentWrapper.hidden;
    toggleButton.textContent = commentWrapper.hidden ? 'Show comments' : 'Hide comments';
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
    nameField.setCustomValidity(name ? '' : 'Enter your name.');
    commentField.setCustomValidity(comment ? '' : 'Enter a comment.');
    if (!form.reportValidity()) return;

    list.append(createComment(name, comment));
    form.reset();
  });
}
