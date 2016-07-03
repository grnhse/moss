window.onload = function() {
  var request = new XMLHttpRequest();
  if (document.getElementById('_moss')) {
    request.open('GET', document.getElementById('_moss').dataset.source, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Generate AST
        var AST = Moss(request.responseText);
        console.log(AST);
        // User is responsible for creating #_moss element
        var container = document.getElementById('_moss');
        // Render recursively the AST and take root element
        var rootElement = renderTree(AST, container);
        // Append root element to container element
        container.appendChild(rootElement);

        var derivationBox = new DerivationBoxElement();
        container.appendChild(derivationBox);

        // If page has hash id of a particular node, display the path to that node
        if (window.location.hash && document.getElementById(window.location.hash.slice(1))) {
          display(document.getElementById(window.location.hash.slice(1)));
        } else {
          // Otherwise, just display the root
          display(rootElement);
        }
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
  }
}
function Moss(dataString) {
  if (!dataString || dataString.constructor !== String) { throw "No data string provided"; }
  // Get a set of the ics to check substrings against
  // (Must be finished before next pass can start)
  var ics = dataString.split(/\n\n+(?=.)/).reduce(function(ics, block) {
    ics[icOf(block)] = true;
    return ics;
  }, {});

  // Create flat set of block nodes
  var icBlockNodes = dataString.split(/\n\n+(?=.)/).reduce(function(icBlockNodes, block) {
    icBlockNodes[icOf(block)] = new BlockNode(block, ics);
    return icBlockNodes;
  }, {});

  var icBlockNodesReference = {};
  for (var key in icBlockNodes) {
    icBlockNodesReference[key] = icBlockNodes[key];
  }

  // Assemble block nodes into tree and return root node
  var tree = assembleTree(icBlockNodes[icOf(dataString)], icBlockNodes, icBlockNodesReference, ics);

  return tree;
}

function BlockNode(block, ics) {
  this.text = block.trim();
  this.id = idFor(icOf(block));
  this.ic = icOf(block);
  this.lines = block.trim().split('\n').map(function(line, index) { return new Line(line, ics, index);});
  this.children = [];
}

function Line(line, ics, index) {
  if (!line || line.constructor !== String) { throw "Invalid line: " + index; }
  this.text = line;
  var lineNode = this;
  lineNode.tokens = [];
  // Split the line into an array of clauses that include their terminal punctuation
  var clauseRegex = / ?([^,.:;?!)'"]+[,.:;?!)'"]+)/g;
  if (line.match(clauseRegex) === null) { throw "No valid clauses on this line: " + line; }

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
          if (ics.hasOwnProperty(capitalize(substring))) {
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

function assembleTree(rootNode, icBlockNodes, icBlockNodesReference, ics) {
  rootNode.lines.forEach(function(lineNode, lineIndex) {
    // Take the link tokens of the block node. For each link node:
    lineNode.tokens.filter(function(token){
      return token.constructor === LinkToken;
    }).forEach(function(linkToken, tokenIndex) {
      // if the link node is an ic, make its type ic
      if (lineIndex === 0 && tokenIndex === 0) {
        linkToken.type = 'ic';
      } else if (icBlockNodes.hasOwnProperty(capitalize(linkToken.text))) {
        // if there is still a block node under that ic, make it the exclusive child and delete its key
        var blockNode = icBlockNodes[capitalize(linkToken.text)];
        rootNode.children.push(blockNode);
        blockNode.parentNode = rootNode;
        delete icBlockNodes[capitalize(linkToken.text)];
        linkToken.type = 'primary';
        linkToken.target = blockNode;
      } else {
        // otherwise make it a secondary non-exclusive link
        linkToken.type = 'secondary';
        linkToken.target = icBlockNodesReference[capitalize(linkToken.text)];
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

function LinkToken(text) {
  this.text = text;
}

function PunctuationToken(text) {
  this.text = text;
}

function icOf(string) {
  return string.split(/[,.;:?!]/)[0];
}

function idFor(text) {
  return text.replace(/[ ]/g, '_').replace(/['")]/g, '').replace(/[&]/g, 'and');
}

function capitalize(text) {
  return text ? text[0].toUpperCase() + text.slice(1) : '';
}
function renderTree(BlockNode) {
  // Every blockNode becomes a section element with one p child and n other section children
  var section = document.createElement('section');
  section.id = BlockNode.id;
  var paragraph = document.createElement('p');
  section.appendChild(paragraph);

  // For each line, for each token of that line,
  BlockNode.lines.forEach(function(line) {
    line.tokens.forEach(function(token) {
      if (token.constructor === TextToken) {
        paragraph.appendChild(document.createTextNode(' ')); // todo: token classes should manage preceeding spaces
        paragraph.appendChild(new SpanElement(token));
      } else if (token.constructor === LinkToken) {
        paragraph.appendChild(document.createTextNode(' '));
        if (token.type === 'primary') {
          paragraph.appendChild(new PrimaryLinkElement(token));
        } else if (token.type === 'secondary') {
          paragraph.appendChild(new SecondaryLinkElement(token));
        } else if (token.type === 'ic') {
          paragraph.appendChild(new IcLinkElement(token));
        }
      } else if (token.constructor === PunctuationToken) {
        paragraph.appendChild(SpanElement(token));
      }
    });
  });

  // For each child node render a subtree and append it to the current element
  BlockNode.children.forEach(function(childBlockNode) {
    var childElement = renderTree(childBlockNode);
    section.appendChild(childElement);
  });

  return section;
}

function DerivationBoxElement() {
  var element = document.createElement('div');
  element.id = '_derivation';
  return element;
}

function SpanElement(token) {
  var textNode = document.createTextNode(token.text);
  return document.createElement('span').appendChild(textNode);
}

function LinkElement(token, clickHandler) {
  var link = document.createElement('a');
  link.appendChild(document.createTextNode(token.text));
  link.href = '#';
  link.addEventListener('click', clickHandler);
  return link;
}

function PrimaryLinkElement(token) {
  var link = LinkElement(token, function(e) {
    e.preventDefault();
    document.getElementById('_derivation').innerHTML = '';
    // If the link is already bolded, unbold it and collapse its children
    if (link.classList.contains('selected')) {
      display(link.parentNode.parentNode);
    } else {
      // Otherwise, display the child element that corresponds to the clicked link
      display(document.getElementById(idFor(capitalize(token.text))));
    }
  });
  return link;
}

function SecondaryLinkElement(token) {
  var link = LinkElement(token, function(e) {
    e.preventDefault();
    e.target.classList.add('selected')
    var derivationBox = document.getElementById('_derivation');
    var blockNode = token.target;
    var derivationElement = DerivationElement(blockNode);
    derivationBox.appendChild(derivationElement);
  });
  return link;
}

function DerivationElement(childBlockNode) {
  var paragraphElement = document.createElement('p');
  var introSpanElement = document.createElement('span');
  var referencingSpanElement = document.createElement('span');

  paragraphElement.appendChild(document.createTextNode('('));

  var parentBlockNode = childBlockNode.parentNode;

  if (parentBlockNode.parentNode) {
    var parentLink = document.createElement('a');
    parentLink.innerText = parentBlockNode.lines[0].tokens[0].text;
    parentLink.href = '#';
    parentLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.target.removeAttribute('href');
      var parentDerivationElement = DerivationElement(parentBlockNode);
      document.getElementById('_derivation').appendChild(parentDerivationElement);
    });
    introSpanElement.appendChild(parentLink);
  } else {
    introSpanElement.appendChild(document.createTextNode(parentBlockNode.lines[0].tokens[0].text));
  }

  introSpanElement.appendChild(document.createTextNode(parentBlockNode.lines[0].tokens.slice(1).map(function(token){return token.text}).join(' ')));

  var referencingLines = parentBlockNode.lines.slice(1).filter(function(line) {
    return line.tokens.filter(function(token) {
      return capitalize(token.text) === childBlockNode.ic;
    }).length > 0;
  });

  referencingSpanElement.innerText = referencingLines.map(function(line){return line.text}).join(' ');

  paragraphElement.appendChild(introSpanElement);
  paragraphElement.appendChild(document.createTextNode(' '));
  paragraphElement.appendChild(referencingSpanElement);
  paragraphElement.appendChild(document.createTextNode(')'));

  var externalLink = document.createElement('a');
  externalLink.href = '#';
  externalLink.innerText = '->';
  externalLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('_derivation').innerHTML = '';
    display(document.getElementById(parentBlockNode.id));
  });
  externalLink.classList.add('external-link');
  paragraphElement.appendChild(document.createTextNode(' '));
  paragraphElement.appendChild(externalLink);

  return paragraphElement;
}

function IcLinkElement(token) {
  var linkElement = LinkElement(token, function(e) {
    e.preventDefault();
    display(e.target.parentNode.parentNode);
  });

  linkElement.classList.add('ic-link');
  return linkElement;
}

function display(element) {
  // Set the window hash to the selected element id
  window.location.hash = element.id;

  // Hide all section elements
  Array.prototype.slice.call(document.getElementsByTagName("section")).forEach(function(sectionElement) {
    sectionElement.style.display = 'none';
  });

  // Unbold all links
  Array.prototype.slice.call(document.getElementsByTagName("a")).forEach(function(linkElement) {
    linkElement.classList.remove('selected');
  });

  //Add hrefs to all ic-links
  Array.prototype.slice.call(document.getElementsByClassName("ic-link")).forEach(function(linkElement) {
    linkElement.href = '#';
  });

  //Remove the href element of the ic-link of the currently displayed element
  document.querySelector('#' + element.id + ' .ic-link').removeAttribute('href');

  //Show path to the current element, not bolding any links in the first lowest paragraph we visit
  showPathTo(element, '');

  function showPathTo(element, linkTextToBold) {
    //Show the current element
    element.style.display = 'block';

    // Look through all spans and links of the current element for a link that matches the linkTextToBold argument
    var linkToBold = Array.prototype.slice.call(element.childNodes[0].childNodes).filter(function(childElement) {
      var linkText = (childElement.innerText||'').trim();
      return (linkText === linkTextToBold || capitalize(linkText) === linkTextToBold) && childElement.tagName === 'A';
    })[0];

    // If you find a linkToBold, bold it
    if(linkToBold) {
      linkToBold.classList.add('selected');
    }

    // If you have reached the top of the tree, return
    if (element.parentNode.id === '_moss') {
      return;
    } else {
      // Otherwise, recursively visit the parent element
      showPathTo(element.parentNode, icOf(element.innerText.trim()));
    }
  }
}

