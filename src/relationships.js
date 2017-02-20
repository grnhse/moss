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

function leftwardLink() {
  return linkBefore(currentLink()) ||
    lastSiblingOf(currentLink());
}

function rightwardLink() {
  return linkAfter(currentLink()) ||
    icLinkOf(currentLink());
}

function upwardLink() {
  return parentLinkOf(currentLink()) ||
    icLinkOfSection(rootSection());
}

function downwardLink() {
  return firstChildLinkOf(currentLink()) ||
    linkAfter(currentLink()) ||
    currentLink();
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
    link = parentLinkOf(link);
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

function getDfsNext(options) {
  var newTab = (options||{}).newTab;
  var skipChildren = (options||{}).skipChildren;

  if (isLastIcChildOfParagraph(currentLink())) {
    return icLinkOf(parentLinkOf(currentLink()));
  }

  if (isIcLink(currentLink())) {
    return nextCousinOf(currentLink()) ||
      icLinkOf(parentLinkOf(currentLink())) ||
      linkAfter(currentLink());
  }

  return (!skipChildren ? linkAfter(firstChildLinkOf(currentLink())) : null) ||
    (!skipChildren ? firstChildLinkOf(currentLink()) : null) ||
    linkAfter(currentLink()) ||
    icLinkOf(currentLink())
}

function getDfsPrevious(options) {
  var newTab = (options||{}).newTab;
  var skipChildren = (options||{}).skipChildren;

  if (currentLink() === rootLink()) {
    return (!skipChildren ? firstChildLinkOf(lastSiblingOf(rootLink())) : null) ||
      lastSiblingOf(rootLink());
  } else if (isIcLink(currentLink())) {
    return (isLastChild(currentLink()) ? parentLinkOf(currentLink()): null) ||
      firstChildLinkOf(lastSiblingOf(currentLink())) ||
      lastSiblingOf(currentLink());
  } else if(isFirstChild(currentLink())) {
      return parentLinkOf(currentLink()) ||
      rootLink();
  } else {
    return (!skipChildren ? firstChildLinkOf(linkBefore(currentLink())) : null) ||
      (!skipChildren ? lastChildLinkOf(linkBefore(parentLinkOf(currentLink()))) : null) ||
      (skipChildren ? linkBefore(currentLink()) : null) ||
      linkBefore(parentLinkOf(currentLink())) ||
      linkBefore(currentLink());
  }
}

function getDfsNextSkipChildren(){
  return getDfsNext({ skipChildren: true });
}

function getDfsPreviousSkipChildren(){
  return getDfsPrevious({ skipChildren: true });
}

function getBfsNext(options) {
  var newTab = (options||{}).newTab;
  var level = currentLink().dataset.level;
  var levelArray = Array.prototype.slice.call(document.getElementsByClassName('level-' + level));
  var nextLevelArray = Array.prototype.slice.call(document.getElementsByClassName('level-' + (Number(level) + 1)));
  var index = levelArray.indexOf(currentLink());

  return levelArray[index + 1] ||
    nextLevelArray[0] ||
    rootLink();
}

function getBfsPrevious(options) {
  var newTab = (options||{}).newTab;
  var level = currentLink().dataset.level;
  var levelArray = Array.prototype.slice.call(document.getElementsByClassName('level-' + level));
  var levelCount = levelArray.length - 1;
  var previousLevelArray = Array.prototype.slice.call(document.getElementsByClassName('level-' + (Number(level - 1))));
  var previousLevelCount = previousLevelArray.length - 1;
  var index = levelArray.indexOf(currentLink());

  return levelArray[index - 1] ||
    previousLevelArray[previousLevelCount] ||
    deepestLink();
}

function downwardOrOpenLink(options) {
  var newTab = (options||{}).newTab || false;

  if (isAliasLink(currentLink())) {
    return linkWithDisplayHash(currentLink().dataset.targetDisplayHash);
  } else if (isUrlLink(currentLink())) {
    openInNewTab(currentLink().href);
    return currentLink();
  } else {
    return firstChildLinkOf(currentLink()) ||
      linkAfter(currentLink());
  }
}

function getAnIcLink(options) {
  var level = (options||{}).level || 0;
  var link = getNthAncestor(level);
  return icLinkOf(link);
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
    link = linkAfter(link);
  }

  return firstChild ? firstChildLinkOf(link) : link;
}

function getALinkInChild(options) {
  var number = (options||{}).number || 0;
  var firstChild = (options||{}).firstChild || false;
  var link = firstChildLinkOf(currentLink());

  for (var i = 0; i < number; i++) {
    link = linkAfter(link);
  }

  return firstChild ? firstChildLinkOf(link) : link
}

function getASiblingLink(options) {
  var number = (options||{}).number || 0;
  var firstChild = (options||{}).firstChild || false;
  var link = icLinkOf(currentLink());

  for (var i = 0; i < number; i++) {
    link = linkAfter(link);
  }

  return firstChild ? firstChildLinkOf(link) : link;
}
