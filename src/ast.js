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
    icBlockNodes[icOf(block)] = new BlockNode(block, ics);
    return icBlockNodes;
  }, {});

  var icBlockNodesReference = {};
  for (var key in icBlockNodes) {
    icBlockNodesReference[key] = icBlockNodes[key];
  }

  // Assemble block nodes into tree and return root node
  var tree = assembleTree(icBlockNodes[icOf(dataString)], icBlockNodes, icBlockNodesReference, ics);

  for (var ic in icBlockNodes) {
    if (ic !== icOf(dataString)) {
      // console.log('No parent for: "' + ic + '"');
    }
  }

  return tree;
}

function BlockNode(block, ics) {
  this.text = block.trim();
  this.id = idFor(icOf(block));
  this.ic = icOf(block);
  var validLines = block.trim().split('\n').filter(notAComment).filter(hasValidClauses);
  this.lines = validLines.map(function(line, index) { return new Line(line.trim(), ics, index);});
  this.children = [];
}

function Line(lineText, ics, lineIndex) {
  if (!lineText || lineText.constructor !== String) { throw new Error("Invalid line: " + lineIndex); }
  this.text = lineText;
  var line = this;
  line.tokens = [];
  // Split the line into an array of clauses that include their terminal punctuation
  var clauseRegex = /.+?[,.:;?!)'"]+(?=(\s|$))/g;

  lineText.match(clauseRegex).forEach(function(clauseWithPunctuation, clauseIndex) {
    var punctuation = clauseWithPunctuation.match(/[,.:;?!)'"]+$/)[0];
    var clause = clauseWithPunctuation.slice(0, -punctuation.length).trim();
    var words = clause.split(' ');

    if (ics.hasOwnProperty(clause.trim())) {
      line.tokens.push(new LinkToken(clause, clause));
    } else {
      // Loop over words of clause removing matches from front
      while (words.length > 0) {
        next_while_loop:
          // for each loop, try each contracting prefix of the current word array
          for (var i = words.length; i > 0; i--) {
            var substring = words.slice(0, i).join(' ');
            if (ics.hasOwnProperty(capitalize(substring))) {
              //if there's a match, remove it from the words array, make a token, and continue to next while loop
              var aliasToken = new LinkToken(substring, clause);
              aliasToken.type = 'alias';
              line.tokens.push(aliasToken);
              words = words.slice(i);
              break next_while_loop;
            }
            // if you get to the end of the words array with no match, remove and tokenize the first word
            var word = words.shift();
            line.tokens.push(new TextToken(word));
          }
      }
    }
    line.tokens.push(new PunctuationToken(punctuation));
  });
}

function assembleTree(rootNode, icBlockNodes, icBlockNodesReference) {
  rootNode.lines.forEach(function(line, lineIndex) {
    // Take the link tokens of the block node. For each link node:
    line.tokens.filter(function(token){
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
        linkToken.type = 'alias';
      }
    });
  });

  // Do the same for the children added in the last pass
  rootNode.children.forEach(function(childNode) {
    assembleTree(childNode, icBlockNodes, icBlockNodesReference);
  });

  return rootNode;
}

function TextToken(text) {
  this.text = text;
}

function LinkToken(text, clause) {
  this.text = text;
  this.id = idFor(capitalize(clause));
  this.targetId = idFor(capitalize(text));
  this.clauseText = clause;
}

function PunctuationToken(text) {
  this.text = text;
}

function icOf(string) {
  return string.split(/[,.;:?!](\s|$)/)[0] || string;
}

function idFor(text) {
  return text.replace(/[ .,;:]/g, '_').replace(/['")]/g, '').replace(/[&]/g, 'and');
}

function capitalize(text) {
  return text ? text[0].toUpperCase() + text.slice(1) : '';
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
