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

function goToAnIcLink(options) {
  openLink(getAnIcLink(options));
}

function goToAPreviousLink(options) {
  openLink(getAPreviousLink(options));
}

function goToASelectedLink(options) {
  openLink(getASelectedLink(options));
}

function goToANextLink(options) {
  openLink(getANextLink(options));
}

function goToLinkInParent(options) {
  openLink(getALinkInParent(options));
}

function goToChild(options) {
  openLink(getALinkInChild(options));
}

function goToSibling(options) {
  openLink(getASiblingLink(options));
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

function goToParentsParent() {
  openLink(
    parentLinkOf(parentLinkOf(currentLink())) ||
    parentLinkOf(currentLink()) ||
    icLinkOf(currentLink())
  )
}

function goToParentsIc() {
  setFragmentToHashOfLink(
    icLinkOf(parentLinkOf(currentLink())) ||
    icLinkOf(currentLink())
  );
}

function goToIcOrParent() {
  if (isIcLink(currentLink())) {
    setFragmentToHashOfLink(parentLinkOf(currentLink()));
  } else {
    setFragmentToHashOfLink(icLinkOf(currentLink()));
  }
}

function goToIc() {
  setFragmentToHashOfLink(icLinkOf(currentLink()));
}

function goToIcOrCollapse() {
  if (isIcLink(currentLink())) {
    setFragmentToHashOfLink(parentLinkOf(currentLink()));
  } else {
    setFragmentToHashOfLink(icLinkOf(currentLink()));
  }
}

function goToEnd() {
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
