function setFragmentToHashOfLink(linkElement) {
  if (linkElement) {
    window.location.hash = linkElement.dataset.displayHash;
  }
}

function openLink(link, newTab) {
  if (newTab) {
    openInNewTab(link);
  } else {
    setFragmentToHashOfLink(link);
  }
}

function openInNewTab(url) {
  window.open(
    url,
    '_blank'
  );
}

function goUp(options) {
  var collapse = (options||{}).collapse || false;
  var cycle = (options||{}).cycle || false;

  var nextLink =
    linkBefore(currentLink()) ||
    (collapse ? parentLinkOf(currentLink()) : null) ||
    (collapse ? rootLink() : null) ||
    (cycle ? lastSiblingOf(currentLink()) : null);

  setFragmentToHashOfLink(nextLink);
}

function goDown(options) {
  var collapse = (options||{}).collapse || false;
  var cycle = (options||{}).cycle || false;

  var nextLink =
    linkAfter(currentLink()) ||
    (collapse ? parentLinkOf(currentLink()) : null) ||
    (cycle ? icLinkOf(currentLink()) : null);

  setFragmentToHashOfLink(nextLink);
}

function closeParagraph() {
  if (isInRootSection(currentLink())) {
    setFragmentToHashOfLink(icLinkOfSection(rootSection()));
  } else {
    setFragmentToHashOfLink(parentLinkOf(currentLink()));
  }
}

function openParagraph() {
  setFragmentToHashOfLink(
    linkAfter(firstChildLinkOf(currentLink())) ||
    firstChildLinkOf(currentLink()) ||
    linkAfter(currentLink()) ||
    currentLink()
  );
}

function goToNextSubject() {
  setFragmentToHashOfLink(
    linkAfter(parentLinkOf(currentLink())) ||
    parentLinkOf(currentLink()) ||
    linkAfter(currentLink())
  );
}

function goToPreviousSubject() {
  setFragmentToHashOfLink(
    linkBefore(parentLinkOf(currentLink())) ||
    parentLinkOf(currentLink()) ||
    linkBefore(currentLink())
  );
}

function goDfsForward(options) {
  var newTab = (options||{}).newTab;
  var skipChildren = (options||{}).skipChildren;

  if (isLastIcChildOfParagraph(currentLink())) {
    return openLink(
      icLinkOf(parentLinkOf(currentLink())),
      newTab
    );
  }

  if (isIcLink(currentLink())) {
    return openLink(
      nextCousinOf(currentLink()) ||
      icLinkOf(parentLinkOf(currentLink())) ||
      linkAfter(currentLink()),
      newTab
    );
  }

  openLink(
    (!skipChildren ? linkAfter(firstChildLinkOf(currentLink())) : null) ||
    (!skipChildren ? firstChildLinkOf(currentLink()) : null) ||
    linkAfter(currentLink()) ||
    icLinkOf(currentLink()),
    newTab
  );
}

function goDfsBackward(options) {
  var newTab = (options||{}).newTab;
  var skipChildren = (options||{}).skipChildren;

  if (currentLink() === rootLink()) {
    openLink(
      (!skipChildren ? firstChildLinkOf(lastSiblingOf(rootLink())) : null) ||
      lastSiblingOf(rootLink())
    , newTab);
  } else if (isIcLink(currentLink())) {
    openLink(
      (isLastChild(currentLink()) ? parentLinkOf(currentLink()): null) ||
      firstChildLinkOf(lastSiblingOf(currentLink())) ||
      lastSiblingOf(currentLink()),
      newTab
    );
  } else if(isFirstChild(currentLink())) {
    openLink(
      parentLinkOf(currentLink()) ||
      rootLink(),
      newTab
    );
  } else {
    openLink(
      (!skipChildren ? firstChildLinkOf(linkBefore(currentLink())) : null) ||
      (!skipChildren ? lastChildLinkOf(linkBefore(parentLinkOf(currentLink()))) : null) ||
      (skipChildren ? linkBefore(currentLink()) : null) ||
      linkBefore(parentLinkOf(currentLink())) ||
      linkBefore(currentLink()),
      newTab
    );
  }
}

function goBfsForward(options) {
  var newTab = (options||{}).newTab;
  var level = currentLink().dataset.level;
  var levelArray = Array.prototype.slice.call(document.getElementsByClassName('level-' + level));
  var nextLevelArray = Array.prototype.slice.call(document.getElementsByClassName('level-' + (Number(level) + 1)));
  var index = levelArray.indexOf(currentLink());

  openLink(
    levelArray[index + 1] ||
    nextLevelArray[0] ||
    rootLink(),
    newTab
  );
}

function goBfsBack(options) {
  var newTab = (options||{}).newTab;
  var level = currentLink().dataset.level;
  var levelArray = Array.prototype.slice.call(document.getElementsByClassName('level-' + level));
  var levelCount = levelArray.length - 1;
  var previousLevelArray = Array.prototype.slice.call(document.getElementsByClassName('level-' + (Number(level - 1))));
  var previousLevelCount = previousLevelArray.length - 1;
  var index = levelArray.indexOf(currentLink());

  openLink(
    levelArray[index - 1] ||
    previousLevelArray[previousLevelCount] ||
    deepestLink(),
    newTab
  );
}


function goToAnIcLink(options) {
  var level = (options||{}).level || 0;
  var link = getNthAncestor(level);
  openLink(icLinkOf(link));
}

function goToAPreviousLink(options) {
  var level = (options||{}).level || 0;
  var firstChild = (options||{}).firstChild || false;
  var link = getNthAncestor(level);
  openLink(
    firstChild ? firstChildLinkOf(linkBefore(link)) : linkBefore(link)
  );
}

function goToASelectedLink(options) {
  var level = (options||{}).level || 0;
  var link = getNthAncestor(level);
  var firstChild = (options||{}).firstChild || false;

  openLink(
    firstChild ? firstChildLinkOf(link) : link
  );
}

function goToANextLink(options) {
  var level = (options||{}).level || 0;
  var link = getNthAncestor(level);
  var firstChild = (options||{}).firstChild || false;

  openLink(
    firstChild ? firstChildLinkOf(linkAfter(link)) : linkAfter(link)
  );
}

function goToChild(options) {
  var number = (options||{}).number || 0;
  var link = firstChildLinkOf(currentLink()) || currentLink();
  for (var i = 0; i < number; i++) {
    link = linkAfter(link) || link;
  }
  openLink(link || currentLink());
}

function goToSibling(options) {
  var number = (options||{}).number || 0;
  var link = icLinkOf(currentLink());
  for (var i = 0; i < number; i++) {
    link = linkAfter(link) || link;
  }
  openLink(link || icLinkOf(currentLink()));
}

function scrollTo(options) {
  var location = (options||{}).location || 0;
  var bottom = window.scrollY + mossContainer().getBoundingClientRect().bottom;
  window.scrollTo(0, (location/3) * (bottom - window.innerHeight));
}

function scrollUp(options) {
  window.scrollBy(0, -150);
}

function scrollDown(options) {
  window.scrollBy(0, 150);
}

function goToRoot() {
  setFragmentToHashOfLink(rootLink());
}

function burrow(options) {
  var newTab = (options||{}).newTab || false;

  if (isAliasLink(currentLink())) {
    window.location = currentLink().href;
  } else if (isUrlLink(currentLink())) {
    openInNewTab(currentLink().href)
  } else {
    var nextLink =
      linkAfter(firstChildLinkOf(currentLink())) ||
      firstChildLinkOf(currentLink()) ||
      linkAfter(currentLink());

    openLink(nextLink, newTab);
  }
}

function unburrow(options) {
  var newTab = (options||{}).newTab || false;

  var nextLink =
    parentLinkOf(currentLink()) ||
    icLinkOf(currentLink());

  openLink(nextLink, newTab);
}

function goToParentsParent() {
  openLink(
    parentLinkOf(parentLinkOf(currentLink())) ||
    parentLinkOf(currentLink()) ||
    icLinkOf(currentLink())
  )
}

function goToParentsIc() {
  setFragmentToHashOfLink(icLinkOf(parentLinkOf(currentLink())));
}

function goToTop() {
  setFragmentToHashOfLink(icLinkOf(currentLink()));
}

function goToTopOrCollapse() {
  if (isIcLink(currentLink())) {
    setFragmentToHashOfLink(parentLinkOf(currentLink()));
  } else {
    setFragmentToHashOfLink(icLinkOf(currentLink()));
  }
}

function goToBottom() {
  setFragmentToHashOfLink(lastSiblingOf(currentLink()));
}

function more () {
  setFragmentToHashOfLink(
    firstChildLinkOf(currentLink()) ||
    linkAfter(currentLink())
  );
}

function goToParentsPreviousSibling() {
  setFragmentToHashOfLink(
    linkAfter(parentLinkOf(currentLink())) ||
    parentLinkOf(currentLink())
  );
}

function goToParentsNextSibling() {
  setFragmentToHashOfLink(
    linkBefore(parentLinkOf(currentLink())) ||
    parentLinkOf(currentLink())
  );
}

function lateralBack() {
  setFragmentToHashOfLink(
    firstChildLinkOf(linkBefore(parentLinkOf(currentLink()))) ||
    linkBefore(parentLinkOf(currentLink()))
  );
}

function lateralNext() {
  setFragmentToHashOfLink(
    firstChildLinkOf(linkAfter(parentLinkOf(currentLink()))) ||
    linkAfter(parentLinkOf(currentLink()))
  );
}

function nextWithJump() {
  setFragmentToHashOfLink(
    linkAfter(currentLink()) ||
    firstChildLinkOf(linkBefore(currentLink()))
  );
}

function backWithJump() {
  setFragmentToHashOfLink(
    linkBefore(currentLink()) ||
    lastChildLinkOf(linkBefore(currentLink()))
  );
}

function duplicateTab() {
  window.open(
    window.location,
    '_blank'
  );
}

function openTabToRoot() {
  debugger;
  window.open(
    window.location.href.split('#')[0],
    '_blank'
  );
}
