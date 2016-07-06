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

  var derivationBox = new DerivationBoxElement();
  container.appendChild(derivationBox);

  document.onkeydown = function(e) {
    console.log(e);
    var currentElement = document.getElementById(window.location.hash.slice(1));
    var rootElement = document.getElementById('_moss').firstChild;

    if (e.keyCode === 37 || e.keyCode === 72) { // Left
      if (currentElement.parentNode.id !== '_moss') {
        display(currentElement.parentNode);
      }
    } else if (e.keyCode === 39 || e.keyCode === 76) { // Right
      if (currentElement.childNodes[1]){
        display(currentElement.childNodes[1]);
      } else if(currentElement.nextSibling) {
        display(currentElement.nextSibling);
      }
    } else if (e.keyCode === 38 || e.keyCode === 75) { // Up
      if (currentElement.previousSibling.previousSibling) {
        display(currentElement.previousSibling);
      } else if(currentElement.parentNode.id !== '_moss') {
        display(currentElement.parentNode);
      }
    } else if (e.keyCode === 40 || e.keyCode === 74) { // Down
      console.log(currentElement.id === rootElement.id, rootElement.childNodes[1]);
      if (currentElement.id === rootElement.id) {
        display(rootElement.childNodes[1]);
      } else if (currentElement.nextSibling || currentElement.childNodes[1]) {
        display(currentElement.nextSibling || currentElement.childNodes[1]);
      }
    }
  }

  // If page has hash id of a particular node, display the path to that node
  if (window.location.hash && document.getElementById(window.location.hash.slice(1))) {
    display(document.getElementById(window.location.hash.slice(1)));
  } else {
    // Otherwise, just display the root
    display(rootElement);
  }
}

function DerivationBoxElement() {
  var element = document.createElement('div');
  element.id = '_derivations';
  return element;
}

