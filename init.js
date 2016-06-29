window.onload = function() {
  var request = new XMLHttpRequest();
  request.open('GET', document.getElementById('_moss').dataset.source, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Generate AST
      var AST = Moss(request.responseText);
      // User is responsible for creating #_moss element
      var container = document.getElementById('_moss');
      // Render recursively the AST and take root element
      var rootElement = renderTree(AST, container);
      // Append root element to container element
      container.appendChild(rootElement);

      var derivationBox = new DerivationBoxElement();
      container.appendChild(derivationBox.element);

      // If page has hash id of a particular node, display the path to that node
      if (window.location.hash && document.getElementById(window.location.hash.slice(1))) {
        display(document.getElementById(window.location.hash.slice(1)));
      } else {
        // Otherwise, just display the root
        display(rootElement);
      }
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}
