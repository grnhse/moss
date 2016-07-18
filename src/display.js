function display(currentLink) {
  if (!currentLink){debugger;}
  var sectionElement;
  if (currentLink.dataset.type === 'parent') {
    sectionElement = document.getElementsByClassName(currentLink.id)[0].parentNode.parentNode;
  } else {
    sectionElement = currentLink.parentNode.parentNode;
  }

  var rootElement = document.getElementById('_moss').firstChild;

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

  //Deselect section and select new section
  Array.prototype.slice.call(document.getElementsByClassName("selected-section")).forEach(function(sectionElement) {
    sectionElement.classList.remove('selected-section');
  });
  sectionElement.classList.add('selected-section');

  window.location.hash = currentLink.dataset.displayHash;

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


