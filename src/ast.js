function AST(dataString) {
  if (!dataString || dataString.constructor !== String) {
    throw new Error("No data string provided");
  }
  // Get a set of the ics to check substrings against
  // (Must be finished before next pass can start)
  var blocks = dataString.split(/\n\n+/).filter(notAComment).filter(notADelimiter);
  var ics = blocks.reduce(function(ics, block) {
    ics[icOf(block)] = true;
    return ics;
  }, {});

  // Create flat set of block nodes
  var icBlockNodes = blocks.reduce(function(icBlockNodes, block) {
    icBlockNodes[icOf(block)] = new BlockNode(block, ics, icBlockNodes);
    return icBlockNodes;
  }, {});

  // Assemble block nodes into tree and return root node
  var tree = assembleTree(icBlockNodes[icOf(dataString)], icBlockNodes, ics);

  delete icBlockNodes[icOf(dataString)];
  tree.orphanList = icBlockNodes;

  return tree;
}

function BlockNode(block, ics, icBlockNodes) {
  this.text = block.trim();
  this.id = idFor(icOf(block));
  this.ic = icOf(block);
  var validLines = block.trim().split('\n').filter(notAComment).filter(hasValidClauses);
  this.lines = validLines.map(function(line, index) { return new Line(line.trim(), ics, index);});
  this.children = [];
  this.orphanList = icBlockNodes;
}

function Line(lineText, ics, lineIndex) {
  if (!lineText || lineText.constructor !== String) {
    throw new Error("Invalid line: " + lineIndex);
  }

  this.text = lineText;
  var line = this;
  line.tokens = [];
  // Split the line into an array of clauses that include their terminal punctuation
  var clauseRegex = /(.+?[,.:;?!)'"]+)(?=(\s|$))/g;

  lineText.match(clauseRegex).forEach(function(clause, clauseIndex) {
    var strings = clause.match(/\s+|\w+|[().,:;?!.'"]/g);

    if (ics.hasOwnProperty(capitalize(clause.trim().replace(/[,:;.!?]/g, '')))) {
      var leadingSpace = clause.match(/^\s*/)[0];
      var clauseText = clause.match(/^\s*(.*?)[,:;.?!]$/)[1];
      var terminalPunctuation = clause.match(/[,:;.?!]$/)[0];

      if (leadingSpace) {
        line.tokens.push(new TextToken(leadingSpace));
      }
      line.tokens.push(new LinkToken(clauseText));
      line.tokens.push(new TextToken(terminalPunctuation));
    } else {
      // Loop over words of clause removing matches from front
      while (strings.length > 0) {
          // for each string set, try each prefix of the current string array
          var aliasLinkFound = false;
          for (var i = strings.length; i > 0; i--) {
            var substring = strings.slice(0, i).join('');
            if (ics.hasOwnProperty(capitalize(substring))) {
              //if there's a match, remove it from the words array, make a token, and continue to next while loop
              var aliasToken = new LinkToken(substring, clause.trim());
              aliasToken.type = 'alias';
              line.tokens.push(aliasToken);
              strings = strings.slice(i);
              aliasLinkFound = true;
              break;
            }
          }

          if (aliasLinkFound) {
            continue;
          }
        // if you get to the end of the words array with no match, remove and tokenize the first word
        var string = strings.shift();
        line.tokens.push(new TextToken(string));
      }
    }
  });
}

function assembleTree(rootNode, icBlockNodes) {
  rootNode.lines.forEach(function(line, lineIndex) {
    // Take the link tokens of the block node. For each link node:
    line.tokens.filter(function(token) {
      return token.constructor === LinkToken;
    }).forEach(function(linkToken, tokenIndex) {
      if (linkToken.type === 'alias') {
        return;
      } else if (lineIndex === 0 && tokenIndex === 0) {
        linkToken.type = 'ic';
      } else if (icBlockNodes.hasOwnProperty(capitalize(linkToken.text))) {
        linkToken.type = 'parent';
        // if there is still a block node under that ic, make it the exclusive child and delete its key
        var blockNode = icBlockNodes[capitalize(linkToken.text)];
        rootNode.children.push(blockNode);
        blockNode.parentNode = rootNode;
        delete icBlockNodes[capitalize(linkToken.text)];
        linkToken.target = blockNode;
      } else {
        linkToken.type = 'duplicate-parent';
      }
    });
  });

  // Do the same for the children added in the last pass
  rootNode.children.forEach(function(childNode) {
    assembleTree(childNode, icBlockNodes);
  });

  return rootNode;
}

function TextToken(text) {
  this.text = text;
}

function LinkToken(text, clause) {
  var clause = clause || text;
  this.text = text;
  this.id = idFor(capitalize(clause)).replace(/[.!?,:;]$/g, ''); //Remove terminal punctuation
  this.targetId = idFor(capitalize(text));
  this.clauseText = clause;
}

function icOf(string) {
  return string.split(/[,.;:?!](\s|$)/)[0] || string;
}

function idFor(text) {
  return text.replace(/[ ]/g, '_').replace(/['"]/g, '').replace(/[&]/g, 'and');
}

function capitalize(text) {
  if (!text) {
    return '';
  }

  if (text[0] !== '(') {
    return text[0].toUpperCase() + text.slice(1)
  }

  if (text[0] === '(') {
    if (text[1]) {
      return text[0] + text[1].toUpperCase() + text.slice(2);
    } else {
      return text[0];
    }
  }
}

function notAComment(line) {
  return !line.match(/^\s*-/);
}

function notADelimiter(line) {
  return !line.match(/^(=|-)+$/);
}

function hasValidClauses(line) {
  var result = !!line.match(/.+?[,.:;?!)'"]+(?=(\s|$))/g);
  if (!result) {console.log('No valid clauses on line: "' + line + '"')}
  return result;
}

