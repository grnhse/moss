document.onkeydown = function(e) {
  // Set current element to the lowest section element on the page.
  var currentElement = currentElement = document.getElementById(window.location.hash.slice(1));

  // The current link is the lowest selected link
  var currentLink = document.querySelector('#' + currentElement.id + ' > p a.selected') ||
    document.querySelector('#' + currentElement.parentNode.id + ' > p a.selected');

  var rootElement = document.getElementById('_moss').firstChild;

  if (e.keyCode === 37 || e.keyCode === 72) { // Left
    if (currentLink.parentNode.parentNode === rootElement) { // If we are at the root, do nothing
      display(rootElement, true);
    } else {
      display(currentElement, false);
    }
  } else if (e.keyCode === 39 || e.keyCode === 76) { // Right
    if (currentLink.dataset.type === 'primary') {
      display(currentElement, true);
    }
  } else if (e.keyCode === 38 || e.keyCode === 75) { // Up
    if (currentLink.dataset.type === 'primary') {
      if (currentElement.previousSibling.tagName === 'SECTION') {
        display(currentElement.previousSibling, false);
      } else {
        display(currentElement.parentNode, true); // Is this a problem?
      }
    }
  } else if (e.keyCode === 40 || e.keyCode === 74) { // Down
    if (currentLink.dataset.type === 'ic') {
      if (currentElement.childNodes[1]) {
        display(currentElement.childNodes[1], false);
      }
    } else if (currentLink.dataset.type === 'primary') {
      if (currentElement.nextSibling) {
        display(currentElement.nextSibling, false);
      }
    }
  }
}

