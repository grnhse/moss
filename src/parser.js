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
      tokens.push(createTokenForFirstUnit(units, tokens, clause));
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

function createTokenForFirstUnit(units, tokens, clause) {
  var string = units[0];
  if (isURL(string)) {
    return new UrlToken(string, clause);
  } else if (isCloseItalicsToken(units, tokens)) {
    return new CloseItalicsToken();
  } else if (isOpenItalicsToken(units, tokens)) {
    return new OpenItalicsToken();
  } else if (isCloseSnippetToken(units, tokens)) {
    return new CloseSnippetToken();
  } else if(isOpenSnippetToken(units, tokens)) {
    return new OpenSnippetToken();
  } else {
    return new TextToken(string);
  }
}

function isURL(string){
  return (/[a-z]{2,256}:\/\/.*/).test(string);
}

function isCloseItalicsToken(units, tokens) {
  return units[0] === '_' && hasOpenItalic(tokens);
}

function isOpenItalicsToken(units, tokens) {
  return units[0] === '_' && units.slice(1).indexOf('_') !== -1;
}

function isCloseSnippetToken(units, tokens) {
  return units[0] === '`' && hasOpenSnippet(tokens);
}

function isOpenSnippetToken(units, tokens) {
  return units[0] === '`' && units.slice(1).indexOf('`') !== -1;
}

function hasOpenItalic(tokens) {
  var numberOpen = tokens.filter(function(token){
    return token.type === 'open-italics' }
  ).length

  var numberClosed = tokens.filter(function(token){
    return token.type === 'close-italics' }
  ).length

  return numberOpen === numberClosed + 1;
}

function hasOpenSnippet(tokens) {
  var numberOpen = tokens.filter(function(token){
    return token.type === 'open-snippet' }
  ).length

  var numberClosed = tokens.filter(function(token){
    return token.type === 'close-snippet' }
  ).length

  return numberOpen === numberClosed + 1;
}

function TextToken(text) {
  this.text = text;
  this.type = 'text';
}

function OpenSnippetToken() {
  this.type = 'open-snippet';
}

function CloseSnippetToken() {
  this.type = 'close-snippet';
}

function OpenItalicsToken() {
  this.type = 'open-italics';
}

function CloseItalicsToken() {
  this.type = 'close-italics';
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
