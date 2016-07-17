document.onkeydown = function(e) {
  if (e.metaKey || e.altKey || e.shiftKey || e.ctrlKey) {
    console.log('ignored key');
    return;
  }
  // Set current element to the lowest section element on the page.
  var currentElement = document.getElementById(window.location.hash.slice(1));

  // The current link is the lowest selected link
  var currentLink = document.querySelector('#' + currentElement.id + ' > p a.selected-link') ||
    document.querySelector('#' + currentElement.parentNode.id + ' > p a.selected-link');

  var rootElement = document.getElementById('_moss').firstChild;

  if (e.keyCode === 37 || e.keyCode === 72) { // Left
    if (currentLink.parentNode.parentNode === rootElement) { // If we are at the root, do nothing
      display(rootElement, rootElement.firstChild.firstChild);
    } else if (currentLink.dataset.type === 'ic') {
      // If an ic is currently selected, display its paragraph without that link selected
      display(currentElement, null)
    } else {
      // Otherwise, a primary link is selected, so hide the lowest paragraph by displaying its parent
      display(currentElement.parentNode, null);
    }
  } else if (e.keyCode === 39 || e.keyCode === 76) { // Right
    // If a primary link is selected, bold the ic of the child paragraph
    if (currentLink.dataset.type === 'parent') {
      display(currentElement, currentElement.firstChild.firstChild);
    }
  } else if (e.keyCode === 38 || e.keyCode === 75) { // Up
    var links = currentLink.parentNode.querySelectorAll('a');
    if (currentLink !== links[0]){
      display(null, links[Array.prototype.slice.call(links).indexOf(currentLink) - 1]);
    }
  } else if (e.keyCode === 40 || e.keyCode === 74) { // Down
    var links = currentLink.parentNode.querySelectorAll('a');
    if (currentLink !== links[links.length - 1]){
      display(null, links[Array.prototype.slice.call(links).indexOf(currentLink) + 1]);
    }
  } else if (e.keyCode === 13) {
    if (currentLink.dataset.type === 'alias') {
      display(document.getElementById(currentLink.dataset.targetId));
    } else if (currentLink.dataset.type === 'parent') {
      display(currentElement, currentElement.firstChild.firstChild);
    }
  }
}

