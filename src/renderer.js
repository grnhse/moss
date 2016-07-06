function renderTree(BlockNode) {
  // Every blockNode becomes a section element with one p child and n other section children
  var section = document.createElement('section');
  section.id = BlockNode.id;
  var paragraph = document.createElement('p');
  section.appendChild(paragraph);

  // For each line, for each token of that line,
  BlockNode.lines.forEach(function(line) {
    line.tokens.forEach(function(token, tokenIndex) {
      if (token.constructor === TextToken) {
        if (tokenIndex > 0) {
          paragraph.appendChild(document.createTextNode(' '));
        }
        paragraph.appendChild(new SpanElement(token));
      } else if (token.constructor === LinkToken) {
        if (tokenIndex > 0) {
          paragraph.appendChild(document.createTextNode(' '));
        }
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
    paragraph.appendChild(document.createElement('br'));
  });

  // For each child node render a subtree and append it to the current element
  BlockNode.children.forEach(function(childBlockNode) {
    var childElement = renderTree(childBlockNode);
    section.appendChild(childElement);
  });

  return section;
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
    document.getElementById('_derivations').innerHTML = '';
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

    e.target.parentNode.childNodes.forEach(function(element) {
      if (element.tagName === 'A') { element.classList.remove('selected'); }
    });
    e.target.classList.add('selected');

    var derivationBox = document.getElementById('_derivations');
    var blockNode = token.target;
    var derivationElement = DerivationElement(blockNode);
    derivationBox.appendChild(derivationElement);
  });
  return link;
}

function DerivationElement(childBlockNode) {
  var paragraphElement = document.createElement('p');
  paragraphElement.id = '_derivations_' + childBlockNode.id;
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
      document.getElementById('_derivations').appendChild(parentDerivationElement);
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
    document.getElementById('_derivations').innerHTML = '';
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
  if (!element || element.id[0] === '_') { return display(document.getElementById('_moss').childNodes[0]); }

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

  //Empty visible derivations
  document.getElementById('_derivations').innerHTML = '';

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
    } else {
      element.childNodes[0].childNodes[0].classList.add('selected');
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

