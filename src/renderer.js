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
      } else if (token.constructor === ParentLinkToken) {
        if (tokenIndex > 0) {
          //If its not the first token, put a space before it
          paragraph.appendChild(document.createTextNode(' '));
        }
        var parentLinkElement = new ParentLinkElement(token);
        parentLinkElement.dataset.targetId = token.targetId;
        parentLinkElement.dataset.id = token.targetId;
        parentLinkElement.dataset.type = 'parent';
        paragraph.appendChild(parentLinkElement);
      } else if (token.constructor === AliasToken) {
        if (tokenIndex > 0) {
          //If its not the first token, put a space before it
          paragraph.appendChild(document.createTextNode(' '));
        }
        var aliasLinkElement = new AliasLinkElement(token);
        aliasLinkElement.dataset.targetId = token.targetId;
        aliasLinkElement.dataset.id = token.targetId;
        paragraph.appendChild(aliasLinkElement);
      } else if (token.constructor === IcLinkToken) {
        if (tokenIndex > 0) {
          //If its not the first token, put a space before it
          paragraph.appendChild(document.createTextNode(' '));
        }
        section.dataset.ic = token.text;
        var icLinkElement = new IcLinkElement(token);
        icLinkElement.dataset.type = 'ic';
        icLinkElement.dataset.id = token.id;
        paragraph.appendChild(icLinkElement);
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
      display(parentLinkElement.parentNode.parentNode, null);
    } else {
      // Otherwise, display the child element that corresponds to the clicked link
      display(document.getElementById(token.targetId), null);
    }
  });

  parentLinkElement.classList.add('parent-link');
  parentLinkElement.dataset.targetId = token.targetId;
  parentLinkElement.dataset.type = 'parent';
  return parentLinkElement;
}

function AliasLinkElement(token) {
  var link = LinkElement(token, function(e) {
    e.preventDefault();
    display(document.getElementById(e.target.dataset.targetId), null);
  });

  link.dataset.type = 'alias';
  link.classList.add('alias-link');

  return link;
}

function IcLinkElement(token) {
  var linkElement = LinkElement(token, function(e) {
    e.preventDefault();
    if (e.target.classList.contains('selected-link')) {
      display(e.target.parentNode.parentNode, null);
    } else {
      display(e.target.parentNode.parentNode, e.target);
    }
  });
  linkElement.classList.add('ic-link');
  return linkElement;
}

