document.onkeydown = function(e) {
  var rootElement = document.getElementById('_moss').firstChild;

  // The current link is the lowest selected link
  var currentLink = document.querySelector(window.location.hash + ' > p a.selected') || rootElement.childNodes[0].childNodes[0];

  // Current element should resolve to the lowest section element on the page.
  // If the current element has no selected link, it is a 'preview paragraph'.
  var currentElement;
  if (currentLink.classList.contains('ic-link')){
    currentElement = document.getElementById(window.location.hash.slice(1));
  } else {
    currentElement = document.getElementById(currentLink.dataset.targetId);
  }

  if (e.keyCode === 37 || e.keyCode === 72) { // Left
    if (currentElement.parentNode.id !== '_moss') { // If we are at the root, do nothing
      if (currentLink.classList.contains('ic-link')) {
        // If the current link is an ic, then pressing left should not remove the currently
        // lowest section element on the page, but should move the selected link from its ic
        // to the referencing link to it in its parent.
        display(currentElement, false);
      } else {
        // If a non-ic link is selected, pressing left should remove the lowest paragraph
        // from the page, and remove the currently selected link, making the previous
        // selected link the currentLink.
        display(currentElement.parentNode, false);
      }
    }
  } else if (e.keyCode === 39 || e.keyCode === 76) { // Right
    // Pressing right takes the preview paragraph and selects its ic.
    display(currentElement, true);
  } else if (e.keyCode === 38 || e.keyCode === 75) { // Up
    // If the current element has a previous tree node sibling, display it and move the selected link.
    if (currentElement.previousSibling.previousSibling) { // (ie, a previous sibling that's not its paragraph element)
      display(currentElement.previousSibling, false);
    // Otherwise, we are at the first child ie the second link is selected, and pressing up should select the ic link
    } else if (!document.querySelector('#' + currentElement.id + ' a.ic-link.selected')) {
      display(currentElement.parentNode, true);
    }
  } else if (e.keyCode === 40 || e.keyCode === 74) { // Down
    // If the ic link is selected and there is a child node to display, display it as a preview
    if (document.querySelector('#' + currentElement.id + ' a.ic-link.selected') && currentElement.childNodes[1]) {
      display(currentElement.childNodes[1], false);
    // Otherwise, if there is a next sibling of the current preview to display, display it as a preview.
    } else if ((document.getElementById(currentLink.dataset.targetId)||{}).nextSibling) {
      display(document.getElementById(currentLink.dataset.targetId).nextSibling, false);
    }
  }
}

