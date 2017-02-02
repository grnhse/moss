(function() {
function ParagraphNodeTree(dataString) {
  var paragraphStrings = splitOnDoubleNewline(dataString);
  var icParagraphNodes = generateParagraphNodes(paragraphStrings);
  var tree = assembleTreeFromNodes(icOf(dataString), icParagraphNodes);

  return tree;
}

function generateParagraphNodes(paragraphStrings) {
  var ics = icsOfParagraphStrings(paragraphStrings);
  printIcsForDebugging(ics);

  return paragraphStrings.
    slice().
    reverse().
    reduce(function(icParagraphNodes, paragraphString){
      var ic = icOf(paragraphString);
      icParagraphNodes[ic] = new ParagraphNode(
        paragraphString,
        ics,
        icParagraphNodes
      );

      return icParagraphNodes;
    }, {});
}

function ParagraphNode(paragraphString, ics, icParagraphNodes) {
  var paragraphNode = this;
  paragraphNode.text = paragraphString;
  paragraphNode.children = [];
  paragraphNode.lines = generateLinesObjects(
    paragraphString,
    ics,
    {
      isParentMatch: function(match) {
        return icParagraphNodes.hasOwnProperty(match);
      },
      onParentMatch: function(match) {
        paragraphNode.children.push(icParagraphNodes[match]);
        delete icParagraphNodes[match];
      }
    }
  );
}

function generateLinesObjects(paragraphString, ics, callbacks) {
  return paragraphString.
    split(/\n/).
    reduce(function(lineObjects, lineText, lineIndex) {
      var lineObject = new Line(
        lineText,
        lineIndex === 0,
        icOf(paragraphString),
        ics,
        callbacks
      );

      lineObjects.push(lineObject);
      return lineObjects;
    }, []);
}

function Line(lineText, isFirstLineOfBlock, currentIc, ics, callbacks) {
  var lineObject = this;
  lineObject.text = lineText;
  lineObject.tokens = clausesWithPunctuationOf(lineText).
    reduce(function(tokens, clause, clauseIndex){
      var newTokens = tokensForClause(
        clause,
        isFirstLineOfBlock && clauseIndex === 0,
        currentIc,
        ics,
        callbacks
      );

      addToArray(tokens, newTokens);
      return tokens;
    }, []);
}

function tokensForClause(clause, isIcClause, currentIc, ics, callbacks) {
  if (isIcClause) {
    return [new IcToken(clause)];
  } else {
    return parseClause(
      clause,
      currentIc,
      ics,
      callbacks
    );
  }
}

function assembleTreeFromNodes(rootIc, icParagraphNodes) {
  var rootNode = icParagraphNodes[rootIc];
  delete icParagraphNodes[rootIc];
  printDebugInfo(rootNode, icParagraphNodes);
  return rootNode;
}

function printDebugInfo(rootNode, icParagraphNodes) {
  if (debugEnabled()) {
    console.log('');
    console.log("AST:", rootNode);
    if (Object.keys(icParagraphNodes).length) {
      console.log('');
      console.log("Orphan list:");
      for (var ic in icParagraphNodes) {
        console.log(icParagraphNodes[ic].text);
      }
    }
  }
}

function addToArray(array, newItems) {
  return Array.prototype.push.apply(array, newItems);
}

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

function deepestLink() {
  var deepestLevel = Array.prototype.slice.
    call(document.querySelectorAll('a')).
    reduce(function(max, link) {
      return Math.max(max, link.dataset.level);
    }, 0);

  var linksOfDeepestLevel = document.querySelectorAll('.level-' + deepestLevel);

  return linksOfDeepestLevel[linksOfDeepestLevel.length - 1];
}
function icOf(string) {
  var ic = clausesWithPunctuationOf(string, true)[0] || '';

  if (['"', "'"].indexOf(ic[0]) > -1) {
    var quotationMark = ic[0];
    if (ic[ic.length -1] !== quotationMark) {
      ic += quotationMark;
    }
  }

  return capitalize(ic);
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
window.onload = function onLoad() {
  if (!mossContainer()) {
    throw new Error('Page must have an html element with id "_moss"');
  }

  if (mossContainer().dataset.source_url) {
    sendRequestTo(mossContainer().dataset.source_url, function success(responseText){
      init(responseText);
    });
  } else if (mossContainer().textContent) {
    init(mossContainer().textContent.trim());
  } else {
    throw new Error('No data string provided');
  }
}

function init(dataString) {
  if (!dataString || dataString.constructor !== String) {
    throw new Error("No data string provided");
  }

  var paragraphNodeTree = ParagraphNodeTree(dataString);
  var sectionElementTree = SectionElementTree(paragraphNodeTree, 0);

  mossContainer().innerHTML = '';
  mossContainer().appendChild(sectionElementTree);

  if (currentLink()){
    show(currentLink());
  } else {
    setFragmentToHashOfLink(rootLink());
  }
}

window.addEventListener('hashchange', function(e) {
  e.preventDefault();
  var hash = fragmentIdOf(e.newURL);

  if (linkWithDisplayHash(hash)) {
    show(linkWithDisplayHash(hash));
  } else {
    setFragmentToHashOfLink(rootLink());
  }
});
var keyNames = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  72: 'h',
  75: 'k',
  74: 'j',
  76: 'l',

  186: ';',
  222: '\'',

  85: 'u',
  73: 'i',
  79: 'o',
  80: 'p',

  219: '[',
  221: ']',

  13: 'return',
  9: 'tab',
  27: 'escape',
  8: 'backspace',
  32: 'space',

  78: 'n',
  77: 'm',
  188: ',',
  190: '.',
  191: '/',

  49: '1',
  50: '2',
  51: '3',
  52: '4',

  81: 'q',
  87: 'w',
  69: 'e',
  82: 'r',

  65: 'a',
  83: 's',
  68: 'd',
  70: 'f',

  90: 'z',
  88: 'x',
  67: 'c',
  86: 'v',

  55: '7',
  56: '8',
  57: '9',
  48: '0',

  189: '-',
  187: '='
}

var shortcutMovements = {
  'down': call(goDown).with({ cycle: true, collapse: false }),
  'up': call(goUp).with({ cycle: false, collapse: true }),
  'right': openParagraph,
  'left': closeParagraph,

  'h': closeParagraph,
  'j': call(goDown).with({ cycle: true, collapse: false }),
  'k': call(goUp).with({ cycle: false, collapse: true }),
  'l': openParagraph,

  '[': goBfsBack,
  ']': goBfsForward,

  'space': call(goDfsForward).with({ skipChildren: true }),
  'shift-space': call(goDfsBackward).with({ skipChildren: true }),
  'return': burrow,
  'shift-return': unburrow,
  'command-return': call(burrow).with({ newTab: true }),
  'ctrl-return': call(burrow).with({ newTab: true }),
  'command-shift-return': call(unburrow).with({ newTab: true }),
  'tab': goDfsForward,
  'shift-tab': goDfsBackward,
  'escape': goToRoot,
  'backspace': unburrow,

  '\'': openTabToRoot,
  ';': duplicateTab,

  'y': goToParentsParent,
  'u': goToParentsIc,
  'i': unburrow,
  'o': goToTop,
  'p': goToBottom,

  'n': call(goToSibling).with({ number: 0 }),
  'm': call(goToSibling).with({ number: 1 }),
  ',': call(goToSibling).with({ number: 2 }),
  '.': call(goToSibling).with({ number: 3 }),
  '/': call(goToSibling).with({ number: 4 }),

  '1': call(goToAnIcLink).with({ level: 3 }),
  '2': call(goToAnIcLink).with({ level: 2 }),
  '3': call(goToAnIcLink).with({ level: 1 }),
  '4': call(goToAnIcLink).with({ level: 0 }),

  'q': call(goToAPreviousLink).with({ level: 3 }),
  'w': call(goToAPreviousLink).with({ level: 2 }),
  'e': call(goToAPreviousLink).with({ level: 1 }),
  'r': call(goToAPreviousLink).with({ level: 0 }),
  'a': call(goToASelectedLink).with({ level: 3 }),
  's': call(goToASelectedLink).with({ level: 2 }),
  'd': call(goToASelectedLink).with({ level: 1 }),
  'f': call(goToASelectedLink).with({ level: 0 }),

  'z': call(goToANextLink).with({ level: 3 }),
  'x': call(goToANextLink).with({ level: 2 }),
  'c': call(goToANextLink).with({ level: 1 }),
  'v': call(goToANextLink).with({ level: 0 }),

  '7': call(scrollTo).with({ location: 0 }),
  '8': call(scrollTo).with({ location: 1 }),
  '9': call(scrollTo).with({ location: 2 }),
  '0': call(scrollTo).with({ location: 3 }),

  '-': scrollUp,
  '=': scrollDown,
}

document.onkeydown = function(e) {
  var modifiers =
    (e.metaKey ? 'command-' : '') +
    (e.altKey ? 'alt-' : '') +
    (e.ctrlKey ? 'ctrl-' : '') +
    (e.shiftKey ? 'shift-' : '');

  var keyName = keyNames[e.keyCode];
  var shortcutName = modifiers + keyName;

  var preventDefaultList = ['space', 'tab'];
  if (preventDefaultList.indexOf(keyName) !== -1) {
    e.preventDefault();
  }

  (shortcutMovements[shortcutName]||function(){})();
}

function call(fcn) {
  return {
    with: function (){
      var originalArguments = Array.prototype.slice.call(arguments);
      return function () {
        fcn.apply(this, originalArguments);
      }
    }
  }
}
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
  var link = getNthAncestor(level);
  openLink(linkBefore(link));
}

function goToASelectedLink(options) {
  var level = (options||{}).level || 0;
  var link = getNthAncestor(level);
  openLink(link);
}

function goToANextLink(options) {
  var level = (options||{}).level || 0;
  var link = getNthAncestor(level);
  openLink(linkAfter(link));
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
function parseClause(clause, currentIc, ics, callbacks) {
  var tokens = [];
  var units = unitsOf(clause);

  while (units.length > 0) {
    var matchEndIndex = findPrefixMatchIn(units, clause, ics);

    if (matchEndIndex) {
      var match = units.slice(0, matchEndIndex).join('');
      tokens.push(createTokenForMatch(match, currentIc, clause, tokens, callbacks));
      units.splice(0, matchEndIndex);
    } else {
      tokens.push(createTokenForFirstUnit(units[0], clause, tokens));
      units.shift();
    }
  }

  return tokens;
}

function findPrefixMatchIn(units, clause, ics) {
  for (var i = units.length; i > 0; i--) {
    var substring = units.slice(0, i).join('');
    var potentialMatch = capitalize(icOf(substring));

    if (matchExists(potentialMatch, clause, ics)) {
      return i;
    }
  }

  return false;
}

function matchExists(potentialMatch, clause, ics){
  return ics.hasOwnProperty(potentialMatch);
}

function createTokenForMatch(match, currentIc, clause, tokens, callbacks) {
  var matchIc = capitalize(icOf(match));
  var isParentMatch = callbacks.isParentMatch(matchIc);

  if (ignoredMatchType(match, clause, currentIc, isParentMatch, tokens)) {
    return new TextToken(match);
  } else if (isParentMatch) {
    callbacks.onParentMatch(matchIc);
    return new ParentToken(match);
  } else {
    return new AliasToken(match, clause);
  }
}

function createTokenForFirstUnit(string, clause) {
  if (isURL(string)) {
    return new UrlToken(string, clause);
  } else {
    return new TextToken(string);
  }
}

function isURL(string){
  return (/[a-z]{2,256}:\/\/.*/).test(string);
}

function TextToken(text) {
  this.text = text;
  this.type = 'text';
}

function IcToken(text) {
  this.text = text;
  this.type = 'ic';
}

function ParentToken(text) {
  this.text = text;
  this.type = 'parent';
}

function AliasToken(text, clause) {
  this.text = text;
  this.clause = clause;
  this.type = 'alias';
}

function UrlToken (string, clause) {
  this.text = clause;
  this.url = string;
  this.type = 'url';
}

function clauseInitialIncompleteMatch(potentialMatch, clause) {
  return clause.indexOf(potentialMatch) === 0 && icOf(potentialMatch) !== icOf(clause);
}

function ignoredMatchType(match, clause, currentIc, isParentMatch, tokens) {
  var matchIc = icOf(match);
  return selfMatch(matchIc, currentIc) ||
    nonAlphanumericMatch(match) ||
    aliasClauseMatch(matchIc, clause, isParentMatch, currentIc) ||
    secondAliasMatchInClause(isParentMatch, tokens);
}

function selfMatch(matchIc, currentIc) {
  return matchIc === currentIc;
}

function nonAlphanumericMatch(match) {
  return (/^\W+$/).test(match);
}

function aliasClauseMatch(match, clause, isParentMatch, currentIc) {
  var clauseIc = icOf(clause);

  if (match === clauseIc && !isParentMatch) {
    if (debugEnabled()) {
      console.log('Invalid alias link: \"' + clauseIc + '\" occuring in \"' + currentIc + '\"');
      console.log('A clause containing an alias link must not be an exact text match of the aliased clause, or they will have the same URL. Try embedding the alias reference in a larger clause that explains the connection.');
    }
    return true;
  } else {
    return false;
  }
}

function secondAliasMatchInClause(isParentMatch, tokens, match, clause) {
  var secondAliasMatch = !isParentMatch &&
    tokens.filter(function(token){
      return token.type === 'alias';
    }).length > 0;

  if (debugEnabled() && secondAliasMatch) {
    console.log("This clause has two alias matches: ", clause);
    console.log("The second match, '" + match + "' will be ignored.");
  }

  return secondAliasMatch;
}
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
function SectionElementTree(paragraphNode, level) {
  var section = document.createElement('section');
  var paragraph = document.createElement('p');
  section.appendChild(paragraph);
  hideSectionElement(section);

  paragraphNode.lines.forEach(function(line) {
    line.tokens.forEach(function(token) {
      var element = linkConstructorForTokenType[token.type](token, level);
      paragraph.appendChild(element);
    });

    paragraph.appendChild(document.createElement('br'));
  });

  paragraphNode.children.forEach(function(childParagraphNode) {
    var childElement = SectionElementTree(childParagraphNode, level + 1);
    section.appendChild(childElement);
  });

  return section;
}

var linkConstructorForTokenType = {
  'text': SpanElement,
  'parent': ParentLinkElement,
  'alias': AliasLinkElement,
  'ic': IcLinkElement,
  'url': UrlLinkElement
}

function SpanElement(token) {
  var textNode = document.createTextNode(token.text);
  var spanElement = document.createElement('span');
  spanElement.appendChild(textNode);
  return spanElement;
}

function IcLinkElement(token, level) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.text) + '/';
  linkElement.href = '#' + displayHashFor(token.text) + '/';
  linkElement.dataset.displayHash = displayHashFor(token.text) + '/';
  linkElement.dataset.type = 'ic';
  linkElement.dataset.level = level;
  linkElement.classList.add('moss-ic-link');
  linkElement.classList.add('level-' + level);
  return linkElement;
}

function ParentLinkElement(token, level) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.text);
  linkElement.href = '#' + displayHashFor(token.text);
  linkElement.dataset.displayHash = displayHashFor(token.text);
  linkElement.dataset.type = 'parent';
  linkElement.dataset.level = level;
  linkElement.classList.add('moss-parent-link');
  linkElement.classList.add('level-' + level);

  return linkElement;
}

function AliasLinkElement(token, level) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.clause);
  linkElement.dataset.displayHash = displayHashFor(capitalize(token.clause));
  linkElement.href = '#' + displayHashFor(capitalize(token.text));
  linkElement.dataset.type = 'alias';
  linkElement.dataset.level = level;
  linkElement.classList.add('moss-alias-link');
  linkElement.classList.add('level-' + level);

  return linkElement;
}

function UrlLinkElement(token, level) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.url));
  linkElement.id = htmlIdFor(token.text);
  linkElement.href = token.url;
  linkElement.setAttribute('target', '_blank');
  linkElement.dataset.type = 'url';
  linkElement.dataset.level = level;
  linkElement.dataset.displayHash = displayHashFor(icOf(token.text));
  linkElement.classList.add('moss-url-link');
  linkElement.classList.add('level-' + level);

  return linkElement;
}
function sendRequestTo(url, success){
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      success(request.responseText);
    } else {
      throw new Error(request.status + ': Server reached but responded with error.');
    }
  };

  request.onerror = function() {
    throw new Error(request.status + ': Connection error: Server could not be reached');
  };

  request.send();
}
window.addEventListener('wheel', function(e) {
  if (e.metaKey || e.altKey || e.ctrlKey) {
    e.preventDefault();
    if (e.deltaY > 10) {
      goDfsBackward();
    } else if (e.deltaY < -10) {
      goDfsForward();
    }
  }
});
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
function splitOnDoubleNewline(dataString) {
  return dataString.trim().split(/\n\n+(?=.)/);
}

function icsOfParagraphStrings(paragraphStrings) {
  return paragraphStrings.reduce(function(ics, paragraphString) {
    var ic = icOf(paragraphString);
    checkForDuplicates(ic, ics, paragraphString);
    ics[ic] = paragraphString;
    return ics;
  }, {});
}

function unitsOf(string) {
  var units = [];
  var stops = ['.', '!', '?', ',', ';', ':'];
  var seperatingPunctuation = ['"', "'", '[', ']', '(', ')', '{', '}', '<', '>'];

  var start = 0;
  for (var i = 0; i < string.length; i++) {
    if (string[i] === ' ') {
      if (start !== i) {
        units.push(string.slice(start, i));
      }

      units.push(string.slice(i, i + 1));
      start = i + 1;
    } else if (seperatingPunctuation.indexOf(string[i]) !== -1) {
      if (string[i - 1] === ' ' || (string[i + 1] === ' ' || string[i + 1] === undefined)) {
        if (start !== i) {
          units.push(string.slice(start, i));
        }
        units.push(string[i]);
        start = i + 1;
      }
    } else if (stops.indexOf(string[i]) !== -1) {
      if (string[i + 1] === ' ' || string[i + 1] === undefined) {
        if (start !== i) {
          units.push(string.slice(start, i));
        }
        units.push(string.slice(i, i + 1));
        start = i + 1;
      }
    } else if (string[i + 1] === undefined) {
      units.push(string.slice(start, i + 1));
    }
  }

  return units;
}

function clausesWithPunctuationOf(string, icOnly) {
  if (!string) {
    return [];
  }

  if (string.indexOf('\n') !== -1) {
    string = string.slice(0, string.indexOf('\n'));
  }

  var clausesWithPunctuation = [];
  var buffer = '';

  while (string.length) {
    var indexOfNextStop = -1;
    for (var i = 0; i < string.length; i++) {
      var stops = ['.', '!', '?', ',', ';', ':'];
      if (stops.indexOf(string[i]) > -1) {
        indexOfNextStop = i;
        break;
      }
    }

    if (indexOfNextStop === -1) {
      if (icOnly) {
        return [buffer + string];
      } else {
        clausesWithPunctuation.push(buffer + string);
      }
      break;
    }

    var charactersThatFollowClauseBreaks = [undefined, ' ', ')', '"', "'"];

    var validClauseBreak = charactersThatFollowClauseBreaks.
      indexOf(string[indexOfNextStop + 1]) !== -1;

    if (validClauseBreak) {
      if (icOnly) {
        return [
          buffer +
          string.slice(0, indexOfNextStop) +
          closingPunctuationOf(string.slice(indexOfNextStop + 1))
        ];
      }

      var clauseString = buffer + string.slice(0, indexOfNextStop + 1);
      var closingPunctuation = closingPunctuationOf(string.slice(indexOfNextStop + 1));
      clauseString += closingPunctuation;
      clausesWithPunctuation.push(clauseString);
      buffer = '';
      string = string.slice(indexOfNextStop + 1 + closingPunctuation.length);
    } else {
      buffer += string.slice(0, indexOfNextStop + 1);
      string = string.slice(indexOfNextStop + 1);
    }
  }

  return clausesWithPunctuation;
}

function closingPunctuationOf(string) {
  return (string.match(/^['")\]}]+/) || {})[0] || '';
}

function checkForDuplicates(ic, ics, paragraphString) {
  if (debugEnabled() && ics.hasOwnProperty(ic)){
    console.log("Paragraphs with duplicate ic: " + ic);
    console.log("Paragraph 1: " + ics[ic]);
    console.log("Paragraph 2: " + paragraphString);
  }
}

function printIcsForDebugging(ics) {
  if (debugEnabled()) {
    console.log("ICs: ");
    console.log(ics);
  }
}
}());
