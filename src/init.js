window.onload = function() {
  var request = new XMLHttpRequest();
  var mossElement = document.getElementById('_moss');
  if (mossElement) {
    if (mossElement.dataset.source) {
      request.open('GET', document.getElementById('_moss').dataset.source, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          init(request.responseText)
        } else {
          // We reached our target server, but it returned an error
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
      };

      request.send();
    } else if(mossElement.innerText) {
      // User may provide text in the moss element
      init(mossElement.innerText.trim());
    }
  }
}

function init(dataString) {
  // Generate AST
  var ast = AST(dataString);
  // User is responsible for creating #_moss element
  var container = document.getElementById('_moss');
  container.innerHTML = ''; //User might be providing data in the element that needs to be cleared
  // Render recursively the AST and take root element
  var rootElement = renderTree(ast, container);
  // Append root element to container element
  container.appendChild(rootElement);

  // If page has hash id of a particular node, display the path to that node
  var hash = window.location.hash;
  var selectedElement = hash ? document.getElementById(window.location.hash.slice(1)) : null;

  if (selectedElement && selectedElement.parentNode.id !== '_moss') {
    display(document.getElementById(window.location.hash.slice(1)), null);
  } else {
    // Otherwise, just display the root
    display(rootElement, rootElement.childNodes[0].childNodes[0]);
  }
}

window.addEventListener('hashchange', function(e) {
  window.setTimeout(function(e){
    // If the hash changes not as a result of the regular display function
    if (document.getElementsByClassName('selected-section')[0].id !== e.newURL.slice(e.newURL.indexOf('#') + 1)) {
      // Allow all previous display invocations to finish updating the hash then display the hash element
      window.setTimeout(display.bind({}, document.getElementById(window.location.hash.slice(1)), null));
    }
  }.bind(this, e), 0);
});
