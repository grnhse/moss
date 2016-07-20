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
          paragraph.appendChild(aliasLinkElement);
        } else if (token.type === 'ic') {
          section.dataset.ic = token.text;
          var icLinkElement = new IcLinkElement(token, rootBlockNode);
          paragraph.appendChild(icLinkElement);
        } else if (token.type === 'duplicate-parent') {
          section.dataset.ic = token.text;
          var spanElement = new SpanElement(token);
          paragraph.appendChild(spanElement);
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

function ParentLinkElement(token) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = token.id;
  linkElement.href = '#' + token.id;
  linkElement.dataset.type = 'parent';
  linkElement.classList.add('parent-link');
  return linkElement;
}

function AliasLinkElement(token) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = token.id;
  linkElement.dataset.targetId = token.targetId;
  linkElement.href = '#' + token.targetId;
  linkElement.dataset.type = 'alias';
  linkElement.classList.add('alias-link');
  return linkElement;
}

function IcLinkElement(token, rootIc) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = token.id + '/';
  linkElement.href = '#' + token.id + '/';
  linkElement.dataset.type = 'ic';
  linkElement.classList.add('ic-link');
  return linkElement;
}

