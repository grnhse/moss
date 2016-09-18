function icOf(string) {
  var ic = clausesWithPunctuationOf(string, true)[0] || '';

  if (['"', "'"].indexOf(ic[0]) > -1) {
    var quotationMark = ic[0];
    if (ic[ic.length -1] !== quotationMark) {
      ic += quotationMark;
    }
  }

  return ic;
}

function displayHashFor(string) {
  return icOf(string).
    replace(/[ #]/g, '_').
    replace(/[&]/g, 'and').
    replace(/[.?!;:,](?=($|\s|[)]'"]))/, '');
}

function htmlIdFor(string) {
  return '_moss_' +
    displayHashFor(string).
    replace(/[\"\']/g, '_quote_');
}

function fragmentIdOf(url) {
  return url.split('#')[1];
}

function htmlIdForDisplayHash(displayHash) {
  var trailingSlash = displayHash.slice(-1) === '/' ? '/' : '';
  var displayHash = trailingSlash ? displayHash.slice(0, -1) : displayHash;
  return htmlIdFor(displayHash) + trailingSlash;
}

function capitalize(text) {
  if (!text) {
    return '';
  }

  var match = (text.match(/^[\W]+/)||[])[0];
  if (!match) {
    return text[0].toUpperCase() + text.slice(1)
  } else {
    if (text[match.length]) {
      return match + text[match.length].toUpperCase() + text.slice(match.length + 1);
    } else {
      return text;
    }
  }
}
