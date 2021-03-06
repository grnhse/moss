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
  var seperatingPunctuation = ['"', "'", '[', ']', '(', ')', '{', '}', '<', '>', '_', '`'];

  var start = 0;
  for (var i = 0; i < string.length; i++) {
    if (string[i] === ' ') {
      if (start !== i) {
        units.push(string.slice(start, i));
      }

      units.push(string.slice(i, i + 1));
      start = i + 1;
    } else if (seperatingPunctuation.indexOf(string[i]) !== -1) {
      if (
        string[i - 1] === ' ' ||
        (string[i + 1] === ' ' || string[i + 1] === undefined) ||
        seperatingPunctuation.indexOf(string[i + 1]) !== -1 ||
        seperatingPunctuation.indexOf(string[i - 1]) !== -1
      ) {
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
