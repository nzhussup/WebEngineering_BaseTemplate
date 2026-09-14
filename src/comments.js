export function initComments() {
  var showHideBtn = document.querySelector('.show-hide');
  var commentWrapper = document.querySelector('.comment-wrapper');
  var form = document.querySelector('.comment-form');
  var nameField = form.querySelector('[name="name"]');
  var commentField = form.querySelector('[name="comment"]');
  var list = document.querySelector('.comment-container');

  showHideBtn.addEventListener('click', () => {
    commentWrapper.hidden = !commentWrapper.hidden;
    showHideBtn.textContent = commentWrapper.hidden ? 'Show comments' : 'Hide comments';
    showHideBtn.setAttribute('aria-expanded', String(!commentWrapper.hidden));
  });

  [nameField, commentField].forEach((field) => {
    field.addEventListener('input', () => {
      field.setCustomValidity('');
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    var name = nameField.value.trim();
    var comment = commentField.value.trim();
    nameField.setCustomValidity(name ? '' : 'Enter your name.');
    commentField.setCustomValidity(comment ? '' : 'Enter a comment.');
    if (!form.reportValidity()) return;

    var listItem = document.createElement('li');
    var namePara = document.createElement('p');
    var commentPara = document.createElement('p');
    namePara.textContent = name;
    commentPara.textContent = comment;
    listItem.append(namePara, commentPara);
    list.appendChild(listItem);
    form.reset();
  });
}
