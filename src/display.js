function display(sectionElement, selectedLinkElement) {
  if (!sectionElement) {
    var sectionElement;
    if (selectedLinkElement) {
      if (selectedLinkElement.dataset.type === 'parent') {
        sectionElement = document.getElementById(selectedLinkElement.dataset.targetId);
      } else {
        sectionElement = selectedLinkElement.parentNode.parentNode;
      }
    }
  }

  var rootElement = document.getElementById('_moss').firstChild;

  if (!sectionElement || sectionElement.id[0] === '_') {
    return display(rootElement, rootElement.firstChild.firstChild);
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

  if (sectionElement === rootElement && !selectedLinkElement) {
    selectedLinkElement = rootElement.firstChild.firstChild;
  }

  // Bold selected link
  if (selectedLinkElement) {
    selectedLinkElement.classList.add('selected-link');
  }

  // Set URL to element id
  window.location.hash = sectionElement.id;
  sectionElement.classList.add('selected-section');

  // Scroll to bottom
  // window.scrollTo(0,document.body.scrollHeight);

  function showPathTo(sectionElement, linkTextToBold) {
    //Show the current sectionElement
    sectionElement.style.display = 'block';

    // Look through all spans and links of the current sectionElement for a link that matches the linkTextToBold argument
    var linkToBold = Array.prototype.slice.call(sectionElement.childNodes[0].childNodes).filter(function(childElement) {
      var linkText = (childElement.innerText||'').trim();
      return (linkText === linkTextToBold || capitalize(linkText) === linkTextToBold) && childElement.tagName === 'A';
    })[0];

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


