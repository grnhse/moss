function Moss(dataString) {
  var AST = getAST(dataString);
  var container = document.getElementById('_moss');
  var rootElement = render(AST);
  rootElement.style.display = 'block';
  container.appendChild(rootElement);
}

function render(BlockNode) {
  var section = document.createElement('section');
  section.style.display = 'none';
  var paragraph = document.createElement('p');
  section.appendChild(paragraph);

  // Render tokens of each line
  BlockNode.lines.forEach(function(line) {
    line.tokens.forEach(function(token) {
      if (token.constructor === TextToken) {
        paragraph.appendChild(new Span(token));
        paragraph.appendChild(document.createTextNode(' '));
      } else if (token.constructor === LinkToken) {
        if (token.type === 'primary') {
          paragraph.appendChild(new PrimaryLink(token));
        } else if (token.type === 'secondary') {
          paragraph.appendChild(new SecondaryLink(token));
        } else if (token.type === 'ic') {
          paragraph.appendChild(new IcLink(token));
        }
      } else if (token.constructor === PunctuationToken) {
        paragraph.appendChild(Span(token));
        paragraph.appendChild(document.createTextNode(' '));
      }
    });
  });

  // call renderRecursive on children
  BlockNode.children.forEach(function(childBlockNode) {
    var childElement = render(childBlockNode);
    section.appendChild(childElement);
  });

  return section;
}

function Span(token) {
  var textNode = document.createTextNode(token.text);
  return document.createElement('span').appendChild(textNode);
}

function Link(token) {
  var link = document.createElement('a');
  link.appendChild(document.createTextNode(token.text));
  link.href = '#';
  return link;
}

function PrimaryLink(token) {
  var link = Link(token);
  link.addEventListener('click', function(e) {

  });
  return link;
}

function SecondaryLink(token) {
  var link = Link(token);
  link.addEventListener('click', function(e) {

  });
  return link;
}

function IcLink(token) {
  var link = Link(token);
  link.addEventListener('click', function(e) {

  });
  return link;
}

function getAST(dataString) {
  var icBlockNodes = {};
  var ics = {};

  // Get a set of the ics to check substrings against
  // (Must be finished before next pass can start)
  var ics = dataString.split(/\n\n+(?=.)/).reduce(function(ics, block) {
    ics[icOf(block)] = true;
    return ics;
  }, {});

  // Create flat set of block nodes
  var icBlockNodes = dataString.split(/\n\n+(?=.)/).reduce(function(icBlockNodes, block, collection) {
    icBlockNodes[icOf(block)] = new BlockNode(block, ics);
    return icBlockNodes;
  }, {});

  // Assemble block nodes into tree and return root node
  return assembleTree(icBlockNodes[icOf(dataString)], icBlockNodes, ics);
}

function BlockNode(block, ics) {
  this.text = block.trim();
  this.ic = icOf(block);
  this.lines = block.trim().split('\n').map(function(line) { return new Line(line, ics);});
  this.children = [];
}

function Line(line, ics) {
  this.text = line;
  var lineNode = this;
  lineNode.tokens = [];
  // Split the line into an array of clauses that include their terminal punctuation
  var clauseRegex = / ?([^,.:;?!)'"]+[,.:;?!)'"]+)/g;
  line.match(clauseRegex).forEach(function(clauseWithPunctuation) {
    var punctuation = clauseWithPunctuation.match(/[,.:;?!)'"]+/)[0];
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
    lineNode.tokens.push(new PunctuationToken(punctuation));
  });
}

function assembleTree(rootNode, icBlockNodes, ics) {
  rootNode.lines.forEach(function(lineNode, lineIndex) {
    // Take the link tokens of the block node. For each link node:
    lineNode.tokens.filter(function(token){return token.constructor === LinkToken}).forEach(function(linkToken, tokenIndex) {
      // if the link node is an ic, make its type ic
      if (lineIndex === 0 && tokenIndex === 0) {
        linkToken.type = 'ic';
      } else if (icBlockNodes.hasOwnProperty(linkToken.target)) {
        // if there is still a block node under that ic, make it the exclusive child and delete its key
        rootNode.children.push(icBlockNodes[linkToken.target]);
        delete icBlockNodes[linkToken.target];
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
  this.target = text.toLowerCase();
}

function PunctuationToken(text) {
  this.text = text;
}

function icOf(string) {
  return string.split(/[,.;:?!]/)[0].toLowerCase();
}

function idFrom(text) {
  return ic.replace(/[ ]/g, '_').replace(/['")]/g, '');
}
