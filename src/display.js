function display(currentLink) {
  var rootElement = document.getElementById('_moss').firstChild;

  if (!currentLink){ var currentLink = rootElement.firstChild.firstChild; }

  var sectionElement;
  if (currentLink.dataset.type === 'parent') {
    sectionElement = document.getElementById(currentLink.id + '/').parentNode.parentNode;
  } else {
    sectionElement = currentLink.parentNode.parentNode;
  }

  if (!sectionElement || sectionElement.id[0] === '_') {
    return display(rootElement.firstChild.firstChild);
  }

  // Hide all section elements
  Array.prototype.slice.call(document.getElementsByTagName("section")).forEach(function(sectionElement) {
    sectionElement.style.display = 'none';
  });

  // Unbold all links
  Array.prototype.slice.call(document.getElementsByTagName("a")).forEach(function(linkElement) {
    linkElement.classList.remove('selected-link');
  });

  // Show path to the current sectionElement, not bolding any links in the first lowest paragraph we visit
  showPathTo(sectionElement, '');

  // Bold selected link
  if (currentLink) {
    currentLink.classList.add('selected-link');
  }

  // For the initial case, where '/' is being requested and redirected to the root link, otherwise noop
  window.location.hash = currentLink.id;

  // Scroll to bottom
  window.scrollTo(0,document.body.scrollHeight);

  function showPathTo(sectionElement, linkTextToBold) {
    //Show the current sectionElement
    sectionElement.style.display = 'block';

    // Look through all spans and links of the current sectionElement for a link that matches the linkTextToBold argument
    var linkToBold = document.getElementById(idFor(linkTextToBold));

    // If you find a linkToBold, bold it
    if(linkToBold) {
      linkToBold.classList.add('selected-link');
    }

    // If you have reached the top of the tree, return
    if (sectionElement.parentNode.id === '_moss') {
      return;
    } else {
      // Otherwise, recursively visit the parent sectionElement
      showPathTo(sectionElement.parentNode, icOf(sectionElement.innerText.trim()));
    }
  }
}


