function Moss(dataString) {
  var icBlockNodes = {};
  var ics = {};

  // Get a set of the ics to check substrings against
  // (Must be finished before next pass can start)
  var ics = dataString.split(/\n\n+(?=.)/).reduce(function(ics, block) {
    ics[icOf(block)] = true;
    return ics;
  }, {});

  // Create flat set of block nodes
  var icBlockNodes = dataString.split(/\n\n+(?=.)/).forEach(function(icBlockNodes, block) {
    icBlockNodes[icOf(block)] = new BlockNode(block, ics);
    return icBlockNodes;
  });

  // Assemble block nodes into tree
  var ast = assembleTree(icBlockNodes[icOf(dataString)], icBlockNodes, ics);
  return ast;
}

function BlockNode(block, ics) {
  this.text = block;
  this.lines = block.trim().split('\n').map(function(line) { return new LineNode(line, ics);});
  this.children = [];
}

function LineNode(line, ics) {
  this.text = line;
  var lineNode = this;
  lineNode.tokens = [];
  // Split the line into an array of clauses that include their terminal punctuation
  var clauseRegex = / ?([^,.:;?!)'"]+[,.:;?!)'"]+)/g;
  line.match(clauseRegex).forEach(function(clauseWithPunctuation) {
    var punctuation = clauseWithPunctuation.match(/[,.:;?!)'"]+/);
    var clause = clauseWithPunctuation.slice(0, -punctuation.length);
    var words = clause.split(' ');
    // Loop over words of clause removing matches from front
    while (words.length > 0) {
      next_while_loop:
      // for each loop, try each contracting prefix of the current word array
      for (var i = words.length; i > 0; i--) {
        var substring = words.slice(0, i).join(' ');
        if (ics.hasOwnProperty(substring.toLowerCase())) {
          //if there's a match, remove it from the words array, make a token, and continue to next while loop
          lineNode.tokens.push(new LinkToken(substring));
          words = words.slice(i);
          break next_while_loop;
        }
        // if you get to the end of the words array with no match, remove and tokenize the first word
        var word = words.shift();
        lineNode.tokens.push(new TextToken(word));
      }
    }
  });
}

function assembleTree(rootNode, icBlockNodes, ics) {
  rootNode.lines.forEach(function(lineNode, lineIndex) {
    // Take the link tokens of the block node. For each link node:
    lineNode.tokens.filter(function(token){return token.constructor === LinkToken}).forEach(function(linkToken, tokenIndex) {
      // if the link node is an ic, make its type ic
      if (lineIndex === 0 && tokenIndex === 0) {
        linkToken.type = 'ic';
      } else if (icBlockNodes.hasOwnProperty(linkToken.ic)) {
        // if there is still a block node under that ic, make it the exclusive child and delete its key
        rootNode.children.push(icBlockNodes[linkToken.ic]);
        delete icBlockNodes[linkToken.ic];
        linkToken.type = 'primary'
      } else {
        // otherwise make it a secondary non-exclusive link
        linkToken.type = 'secondary'
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

function LinkToken(text) {
  this.text = text;
  this.ic = text.toLowerCase();
}

function icOf(string) {
  return string.split(/[,.;:?!]/)[0].toLowerCase();
}
