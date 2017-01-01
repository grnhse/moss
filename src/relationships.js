function sectionElementOfLink(linkElement) {
  return linkElement.parentNode.parentNode;
}

function icLinkOfSection(sectionElement) {
  return sectionElement.firstChild.firstChild;
}

function parentSectionOf(linkElement) {
  if (linkElement === null) {
    return null;
  }

  return linkElement.parentNode.parentNode;
}

function isIcLink(linkElement) {
  return linkElement.dataset.type === 'ic';
}

function isParentLink(linkElement) {
  return linkElement.dataset.type === 'parent';
}

function isAliasLink(linkElement) {
  return linkElement.dataset.type === 'alias';
}

function isUrlLink(linkElement) {
  return linkElement.dataset.type === 'url';
}

function isInRootSection(linkElement) {
  return parentSectionOf(linkElement) === rootSection();
}

function firstChildLinkOf(linkElement) {
  if (linkElement === null){
    return null;
  }

  return linkWithDisplayHash(linkElement.dataset.displayHash + '/');
}

function icLinkOf(linkElement) {
  if (isIcLink(linkElement)) {
    return linkElement;
  }

  return linkElement.parentNode.firstChild;
}

function parentLinkOf(linkElement) {
  if (linkElement === null) {
    return null;
  }

  if (isInRootSection(linkElement)) {
    return null;
  }

  var icLink = icLinkOf(linkElement);

  return linkWithDisplayHash(icLink.dataset.displayHash.slice(0, -1));
}

function lastChildLinkOf(linkElement) {
  if (linkElement === null){
    return null;
  }

  if (isIcLink(linkElement)) {
    return null;
  }

  if (isParentLink(linkElement)) {
    var childIcLink = firstChildLinkOf(linkElement);
    var links = childIcLink.parentNode.querySelectorAll('a');
    return links[links.length - 1] || null;
  } else {
    return null;
  }
}

function linkAfter(linkElement) {
  if (linkElement === null) {
    return null;
  }

  var links = linkElement.parentNode.querySelectorAll('a');
  if (linkElement !== links[links.length - 1]){
    return links[
      Array.prototype.slice.call(links).indexOf(linkElement) + 1
    ];
  } else {
    return null;
  }
}

function linkBefore(linkElement) {
  if (linkElement === null) {
    return null;
  }

  var links = linkElement.parentNode.querySelectorAll('a');
  if (linkElement !== links[0]){
    return links[
      Array.prototype.slice.call(links).indexOf(linkElement) - 1
    ];
  } else {
    return null;
  }
}

function lastSiblingOf(linkElement) {
  if (linkElement === null){
    return null;
  }

  var links = linkElement.parentNode.querySelectorAll('a');
  return links[links.length - 1] || null;
}

function nextCousinOf(linkElement) {
  if (linkElement === null) {
    return null;
  }

  return linkAfter(linkElement) ||
    nextCousinOf(parentLinkOf(linkElement));
}

function lastDescendantLinkOf(linkElement) {
  if (linkElement === null) {
    return null;
  }

  if (isIcLink(linkElement)) {
    return linkElement;
  }

  if (!lastChildLinkOf(linkElement)) {
    return linkElement;
  }

  return lastDescendantLinkOf(lastChildLinkOf(linkElement));
}
