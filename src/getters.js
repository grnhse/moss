function rootLink() {
  return document.querySelector('#_moss a');
}

function rootSection() {
  return document.querySelector('#_moss section');
}

function mossContainer() {
  return document.getElementById('_moss');
}

function debugEnabled() {
  return mossContainer().dataset.debug === "true";
}

function currentDisplayHash() {
  return window.location.hash.substr(1);
}

function currentLink() {
  return document.getElementById(htmlIdForDisplayHash(currentDisplayHash()));
}

function linkWithDisplayHash(hash) {
  var linkHtmlId = htmlIdForDisplayHash(hash);
  return document.getElementById(linkHtmlId);
}
