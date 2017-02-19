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

function isLastIcChildOfParagraph (linkElement) {
  return linkElement === firstChildLinkOf(lastSiblingOf(parentLinkOf(currentLink())));
}

function isFirstChild(linkElement) {
  return linkElement === linkAfter(icLinkOf(linkElement));
}

function isLastChild(linkElement) {
  return linkElement === lastSiblingOf(linkElement);
}

function firstChildLinkOf(linkElement) {
  if (linkElement === null){
    return null;
  }

  return linkWithDisplayHash(linkElement.dataset.displayHash + '/');
}

function icLinkOf(linkElement) {
  if (linkElement === null){
    return null;
  }

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

function getNthAncestor(level) {
  var link = currentLink();
  for (var i = 0; i < level; i++) {
    link = parentLinkOf(link) || link;
  }
  return link;
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

function firstSiblingOf(linkElement) {
  if (linkElement === null){
    return null;
  }

  var links = linkElement.parentNode.querySelectorAll('a');
  return links[1] || linkElement;
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

  return nextExtendedSiblingOf(parentLinkOf(linkElement));

  function nextExtendedSiblingOf(linkElement) {
    if (linkElement === null) {
      return null;
    }

    return linkAfter(linkElement) ||
      nextExtendedSiblingOf(parentLinkOf(linkElement));
  }
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

function getAPreviousLink(options) {
  var level = (options||{}).level || 0;
  var firstChild = (options||{}).firstChild || false;
  var link = getNthAncestor(level);

  return firstChild ? firstChildLinkOf(linkBefore(link)) : linkBefore(link);
}

function getASelectedLink(options) {
  var level = (options||{}).level || 0;
  var link = getNthAncestor(level);
  var firstChild = (options||{}).firstChild || false;

  return  firstChild ? firstChildLinkOf(link) : link
}

function getANextLink(options) {
  var level = (options||{}).level || 0;
  var link = getNthAncestor(level);
  var firstChild = (options||{}).firstChild || false;

  return firstChild ? firstChildLinkOf(linkAfter(link)) : linkAfter(link)
}

function getALinkInParent(options) {
  var number = (options||{}).number || 0;
  var firstChild = (options||{}).firstChild || false;

  var link = icLinkOf(parentLinkOf(currentLink())) ||
    icLinkOf(currentLink());

  for (var i = 0; i < number; i++) {
    link = linkAfter(link) || link;
  }

  return firstChild ? firstChildLinkOf(link) : link;
}

function getALinkInChild(options) {
  var number = (options||{}).number || 0;
  var firstChild = (options||{}).firstChild || false;
  var link = firstChildLinkOf(currentLink()) || currentLink();

  for (var i = 0; i < number; i++) {
    link = linkAfter(link) || link;
  }

  return firstChild ? firstChildLinkOf(link) : link
}

function getASiblingLink(options) {
  var number = (options||{}).number || 0;
  var firstChild = (options||{}).firstChild || false;
  var link = icLinkOf(currentLink());

  for (var i = 0; i < number; i++) {
    link = linkAfter(link) || link;
  }

  return (firstChild ? firstChildLinkOf(link) : link) ||
    icLinkOf(currentLink());
}
