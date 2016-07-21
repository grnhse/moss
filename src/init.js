window.onload = function() {
  var request = new XMLHttpRequest();
  var mossContainer = document.getElementById('_moss');
  if (mossContainer) {
    if (mossContainer.dataset.source) {
      request.open('GET', document.getElementById('_moss').dataset.source, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          init(request.responseText)
        } else {
          throw new Error('Server error');
        }
      };

      request.onerror = function() {
        throw new Error('Connection error');
      };

      request.send();
    } else if(mossContainer.innerText) {
      // User may provide text in the moss element
      init(mossContainer.innerText.trim());
    }
  }

  function init(dataString) {
    // Generate AST
    var ast = AST(dataString);
    // User is responsible for creating #_moss element
    mossContainer.innerHTML = ''; //User might be providing data in the element that needs to be cleared
    // Render recursively the AST and take root element
    var rootElement = renderTree(ast);
    // Append root element to mossContainer element
    mossContainer.appendChild(rootElement);

    // If page has hash id of a particular node, display the path to that node
    var hash = window.location.hash;

    if (hash) {
      display(document.getElementById(hash.slice(1)));
    } else {
      // Otherwise, just display the root
      display(rootElement.childNodes[0].childNodes[0]);
    }
  }
}

window.addEventListener('hashchange', function(e) {
  e.preventDefault();
  display(document.getElementById(e.newURL.split('#')[1]));
});
