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
  var cycle = (options||{}).cycle || true;

  var nextLink =
    linkBefore(currentLink()) ||
    (cycle ? lastSiblingOf(currentLink()) : null);
    (collapse ? parentLinkOf(currentLink()) : null) ||
    (collapse ? rootLink() : null) ||

  setFragmentToHashOfLink(nextLink);
}

function goDown(options) {
  var collapse = (options||{}).collapse || false;
  var cycle = (options||{}).cycle || true;

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
  if (isParentLink(currentLink())) {
    setFragmentToHashOfLink(firstChildLinkOf(currentLink()));
  }
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
  var nextLink =
    firstChildLinkOf(currentLink()) ||
    linkAfter(currentLink()) ||
    nextCousinOf(currentLink()) ||
    rootLink();

  openLink(nextLink, newTab);
}

function goDfsBack(options) {
  var newTab = (options||{}).newTab;
  if (currentLink() === rootLink()) {
    openLink(lastDescendantLinkOf(lastSiblingOf(rootLink())), newTab);
  } else if (isIcLink(currentLink())) {
    openLink(parentLinkOf(currentLink()), newTab);
  } else {
    openLink(lastDescendantLinkOf(linkBefore(currentLink())), newTab);
  }
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

function rooksNext() {
  setFragmentToHashOfLink(
    linkAfter(firstChildLinkOf(currentLink())) ||
    firstChildLinkOf(currentLink()) ||
    linkAfter(currentLink())
  );
}

function duplicateTab() {
  window.open(
    window.location,
    '_blank'
  );
}

function openTabToRoot() {
  window.open(
    window.location.href.split('#')[0],
    '_blank'
  );
}