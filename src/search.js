export function initSearch() {
  var form = document.querySelector('.search');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var searchKey = form.querySelector('[name="q"]').value.trim();

    document.querySelectorAll('article').forEach(function(article) {
      article.querySelectorAll('mark.highlight').forEach(function(mark) {
        var parent = mark.parentNode;
        mark.replaceWith(document.createTextNode(mark.textContent));
        parent.normalize();
      });
      if (!searchKey) return;

      var regex = new RegExp(searchKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      var walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          return node.parentElement.closest('script, style, form, button')
            ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      // Collect first: changing the tree while walking it can skip text nodes.
      var textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      textNodes.forEach(function(node) {
        var fragment = document.createDocumentFragment();
        var position = 0;
        for (var match of node.nodeValue.matchAll(regex)) {
          fragment.append(document.createTextNode(node.nodeValue.slice(position, match.index)));
          var mark = document.createElement('mark');
          mark.className = 'highlight';
          mark.textContent = match[0];
          fragment.append(mark);
          position = match.index + match[0].length;
        }
        if (position === 0) return;
        fragment.append(document.createTextNode(node.nodeValue.slice(position)));
        node.replaceWith(fragment);
      });
    });
  });
}
