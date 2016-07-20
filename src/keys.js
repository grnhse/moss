document.onkeydown = function(e) {
  if (e.metaKey || e.altKey || e.shiftKey || e.ctrlKey) {
    return;
  }

  // The current link is the lowest selected link
  var selectedLinks = document.getElementsByClassName('selected-link')
  var currentLink = selectedLinks[selectedLinks.length - 1];
  var rootElement = document.getElementById('_moss').firstChild;

  if (e.keyCode === 37 || e.keyCode === 72) { // Left
    if (currentLink.parentNode.parentNode === rootElement) { // If we are at the root, do nothing
      window.location.hash = rootElement.firstChild.firstChild.id
    } else {
      window.location.hash = currentLink.parentNode.firstChild.id.slice(0, -1);
    }
  } else if (e.keyCode === 39 || e.keyCode === 76) { // Right
    // If a primary link is selected, bold the ic of the child paragraph
    if (currentLink.dataset.type === 'parent') {
      window.location.hash = currentLink.id + '/';
    }
  } else if (e.keyCode === 38 || e.keyCode === 75) { // Up
    var links = currentLink.parentNode.querySelectorAll('a');
    if (currentLink !== links[0]){
      window.location.hash = links[Array.prototype.slice.call(links).indexOf(currentLink) - 1].id;
    }
  } else if (e.keyCode === 40 || e.keyCode === 74) { // Down
    var links = currentLink.parentNode.querySelectorAll('a');
    if (currentLink !== links[links.length - 1]){
      window.location.hash = links[Array.prototype.slice.call(links).indexOf(currentLink) + 1].id;
    }
  } else if (e.keyCode === 13) {
    if (currentLink.dataset.type === 'alias') {
      window.location.hash = currentLink.dataset.targetId;
    } else if (currentLink.dataset.type === 'parent') {
      window.location.hash = currentLink.id + '/';
    }
  }
}

