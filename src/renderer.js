function renderTree(BlockNode, rootBlockNode) {
  // Every blockNode becomes a section element with one p child and n other section children
  var section = document.createElement('section');
  // section.classList.add(BlockNode.id);
  var paragraph = document.createElement('p');
  section.appendChild(paragraph);

  // For each line, for each token of that line,
  BlockNode.lines.forEach(function(line, lineIndex) {
    line.tokens.forEach(function(token, tokenIndex) {
      if (token.constructor === TextToken) {
        if (tokenIndex > 0) {
          paragraph.appendChild(document.createTextNode(' '));
        }
        paragraph.appendChild(new SpanElement(token));
      } else if (token.constructor === LinkToken){
        if (token.type === 'parent') {
          if (tokenIndex > 0) {
            //If its not the first token, put a space before it
            paragraph.appendChild(document.createTextNode(' '));
          }
          var parentLinkElement = new ParentLinkElement(token);
          paragraph.appendChild(parentLinkElement);
        } else if (token.type === 'alias') {
          if (tokenIndex > 0) {
            //If its not the first token, put a space before it
            paragraph.appendChild(document.createTextNode(' '));
          }
          var aliasLinkElement = new AliasLinkElement(token);
          aliasLinkElement.dataset.targetId = token.targetId;
          aliasLinkElement.dataset.id = token.targetId;
          paragraph.appendChild(aliasLinkElement);
        } else if (token.type === 'ic') {
          section.dataset.ic = token.text;
          var icLinkElement = new IcLinkElement(token, rootBlockNode);
          icLinkElement.dataset.type = 'ic';
          icLinkElement.dataset.id = token.id;
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

function ParentLinkElement(token) {
  var parentLinkElement = LinkElement(token, function(e) {
    e.preventDefault();

    // If the link is already bolded, unbold it and collapse its children
    if (parentLinkElement.classList.contains('selected-link')) {
      display(parentLinkElement.parentNode.parentNode);
    } else {
      // Otherwise, display the child element that corresponds to the clicked link
      display(document.getElementById(token.id));
    }
  });

  parentLinkElement.dataset.displayHash = token.id;
  parentLinkElement.id = token.id;
  parentLinkElement.classList.add('parent-link');
  parentLinkElement.dataset.type = 'parent';
  return parentLinkElement;
}

function AliasLinkElement(token) {
  var link = LinkElement(token, function(e) {
    e.preventDefault();
    display(document.getElementById(e.target.dataset.targetId));
  });

  link.id = token.id;
  link.dataset.displayHash = token.id;
  link.dataset.type = 'alias';
  link.classList.add('alias-link');

  return link;
}

function IcLinkElement(token, rootIc) {
  var linkElement = LinkElement(token, function(e) {
    e.preventDefault();
    if (e.target.classList.contains('selected-link')) {
      display(document.getElementById(e.target.dataset.id));
    } else {
      display(e.target);
    }
  });

  if (rootIc) {
    linkElement.id = token.id;
  }

  linkElement.dataset.displayHash = token.id;
  linkElement.classList.add(token.id);
  linkElement.dataset.childId = token.id;
  linkElement.classList.add('ic-link');
  return linkElement;
}

