function show(linkElement) {
  hideAllSectionElements();
  deselectAllLinks();
  showPathTo(linkElement);
  showPreviewIfParentLink(linkElement);
  window.scrollTo(0, mossContainer().scrollHeight);
}

function showPathTo(linkElement) {
  showSectionElementOfLink(linkElement);
  boldLink(linkElement);

  if (isInRootSection(linkElement)) {
    return;
  } else {
    showPathTo(parentLinkOf(linkElement));
  }
}

function hideAllSectionElements() {
  forEach(document.getElementsByTagName("section"), function(sectionElement) {
    sectionElement.style.display = 'none';
  });
}

function deselectAllLinks() {
  forEach(document.getElementsByTagName("a"), function(linkElement) {
    linkElement.classList.remove('moss-selected-link');
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

function boldLink(linkElement) {
  linkElement.classList.add('moss-selected-link');
}
