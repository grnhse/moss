function show(linkElement, options) {
  var options = options || {};

  resetPage();
  showPathTo(linkElement);

  if (options.scroll !== false) {
    window.scrollTo(0, mossContainer().scrollHeight);
  }
}

function showPathTo(linkElement) {
  showPathToRecursive(linkElement);

  showPreviewIfParentLink(linkElement);
  linkElement.classList.add('moss-selected-link');

  function showPathToRecursive(linkElement) {
    showSectionElementOfLink(linkElement);
    underlineLink(linkElement);

    if (isInRootSection(linkElement)) {
      return;
    } else {
      showPathToRecursive(parentLinkOf(linkElement));
    }
  }
}

function resetPage() {
  hideAllSectionElements();
  deselectAllLinks();
}

function hideAllSectionElements() {
  forEach(document.getElementsByTagName("section"), function(sectionElement) {
    sectionElement.style.display = 'none';
  });
}

function deselectAllLinks() {
  forEach(document.getElementsByTagName("a"), function(linkElement) {
    linkElement.classList.remove('moss-selected-link');
    linkElement.classList.remove('moss-open-link');
  });
}

function forEach(list, callback) {
  for (var i = 0; i < list.length; i++) {
    callback(list[i]);
  }
}

function hideSectionElement(sectionElement) {
  sectionElement.style.display = 'none';
}

function showSectionElement(sectionElement) {
  sectionElement.style.display = 'block';
}

function showSectionElementOfLink(linkElement) {
  showSectionElement(sectionElementOfLink(linkElement));
}

function showPreviewIfParentLink(linkElement) {
  if (isParentLink(linkElement)) {
    showSectionElementOfLink(firstChildLinkOf(linkElement));
  }
}

function underlineLink(linkElement) {
  linkElement.classList.add('moss-open-link');
}
