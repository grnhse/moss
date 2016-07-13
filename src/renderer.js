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
          var primaryLinkElement = new PrimaryLinkElement(token);
          primaryLinkElement.dataset.targetId = token.target.id;
          paragraph.appendChild(primaryLinkElement);
        } else if (token.type === 'secondary') {
          paragraph.appendChild(new SecondaryLinkElement(token));
        } else if (token.type === 'ic') {
          section.dataset.ic = token.text;
          var icLinkElement = new IcLinkElement(token);
          paragraph.appendChild(icLinkElement);
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

  link.dataset.type = 'secondary';

  return link;
}

function IcLinkElement(token) {
  var linkElement = LinkElement(token, function(e) {
    e.preventDefault();
    if (e.target.classList.contains('selected')) {
      display(e.target.parentNode.parentNode, false);
    } else {
      display(e.target.parentNode.parentNode, true);
    }
  });
  linkElement.classList.add('ic-link');
  return linkElement;
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

function display(sectionElement, lastIcSelected) {
  var rootElement = document.getElementById('_moss').firstChild;

  if (!sectionElement || sectionElement.id[0] === '_') {
    return display(document.getElementById('_moss').childNodes[0]);
  }

  // If the caller wants sectionElement's ic link selected, the fragment id becomes sectionElement's id.
  if (lastIcSelected) {
    window.location.hash = sectionElement.id;
  // If not, we are going to bold a non-ic link and preview its child, but not change the fragment id,
  // The fragment id should remain that of the paragraph in which the bolded link occurs, because the user
  // has not yet selected to advance to the previewed paragraph.
  } else {
    window.location.hash = sectionElement.id === rootElement.id ? rootElement.id : sectionElement.parentNode.id;
  }

  // Hide all section elements
  Array.prototype.slice.call(document.getElementsByTagName("section")).forEach(function(sectionElement) {
    sectionElement.style.display = 'none';
  });

  // Unbold all links
  Array.prototype.slice.call(document.getElementsByTagName("a")).forEach(function(linkElement) {
    linkElement.classList.remove('selected');
  });

  //Empty visible derivations
  document.getElementById('_derivations').innerHTML = '';

  //Show path to the current sectionElement, not bolding any links in the first lowest paragraph we visit
  showPathTo(sectionElement, lastIcSelected ? sectionElement.dataset.ic : '');

  //If root, bold ic link
  if (sectionElement.parentNode.id === '_moss') {
    document.querySelector('#' + sectionElement.id + " > p a.ic-link").classList.add('selected');
  }

  function showPathTo(sectionElement, linkTextToBold) {
    //Show the current sectionElement
    sectionElement.style.display = 'block';

    // Look through all spans and links of the current sectionElement for a link that matches the linkTextToBold argument
    var linkToBold = Array.prototype.slice.call(sectionElement.childNodes[0].childNodes).filter(function(childElement) {
      var linkText = (childElement.innerText||'').trim();
      return (linkText === linkTextToBold || capitalize(linkText) === linkTextToBold) && childElement.tagName === 'A';
    })[0];

    // If you find a linkToBold, bold it
    if(linkToBold) {
      linkToBold.classList.add('selected');
    }

    // If you have reached the top of the tree, return
    if (sectionElement.parentNode.id === '_moss') {
      return;
    } else {
      // Otherwise, recursively visit the parent sectionElement
      showPathTo(sectionElement.parentNode, icOf(sectionElement.innerText.trim()));
    }
  }
}


