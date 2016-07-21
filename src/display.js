function display(currentLink) {
  var mossContainer = document.getElementById('_moss');
  var rootElement = mossContainer.firstChild;

  if (!currentLink){
    if (window.display.hash) {
      var currentLink = document.getElementById(window.display.hash.slice(1));
    } else {
      var currentLink = rootElement.firstChild.firstChild;
    }
  }

  var sectionElement;
  if (currentLink.dataset.type === 'parent') {
    sectionElement = document.getElementById(currentLink.id + '/').parentNode.parentNode;
  } else {
    sectionElement = currentLink.parentNode.parentNode;
  }

  if (!sectionElement || sectionElement === mossContainer) {
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

  // Recursively go up the tree from the leaf node, displaying each paragraph and bolding the link in the parent
  // paragraph that corresponds to the ic of the child paragraph.
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
    if (sectionElement.parentNode === mossContainer) {
      return;
    } else {
      // Otherwise, visit the parent section of the current one and in it, bold the parent link which references
      // the current section element's ic.
      showPathTo(sectionElement.parentNode, sectionElement.firstChild.firstChild.innerText);
    }
  }
}


