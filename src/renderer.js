function renderTree(blockNode) {
  // Every blockNode becomes a section element with one p child and n other section children
  var section = document.createElement('section');
  var paragraph = document.createElement('p');
  section.appendChild(paragraph);

  // For each line, for each token of that line,
  blockNode.lines.forEach(function(line, lineIndex) {
    line.tokens.forEach(function(token, tokenIndex) {
      if (token.constructor === TextToken) {
        paragraph.appendChild(new SpanElement(token));

      } else if (token.constructor === LinkToken){
        if (token.type === 'parent') {
          var parentLinkElement = new ParentLinkElement(token);
          paragraph.appendChild(parentLinkElement);
        } else if (token.type === 'alias') {
          // An alias link that points to a paragraph that was never integrated by
          // parent reference, ie an orphan, should be rendered as a span.
          if (blockNode.orphanList.hasOwnProperty(capitalize(token.text))) {
            var spanElement = SpanElement(token);
            spanElement.classList.add('broken-alias-link-to-unrendered-block');
            paragraph.appendChild(spanElement);
          } else {
            // If the alias points to a valid paragraph, render it
            var aliasLinkElement = new AliasLinkElement(token);
            paragraph.appendChild(aliasLinkElement);
          }
        } else if (token.type === 'ic') {
          section.dataset.ic = token.text;
          var icLinkElement = new IcLinkElement(token);
          paragraph.appendChild(icLinkElement);
        } else if (token.type === 'duplicate-parent') {
          var spanElement = SpanElement(token);
          spanElement.classList.add('duplicate-parent-reference');
          paragraph.appendChild(spanElement);
        }

      } else if (token.constructor === PunctuationToken) {
        paragraph.appendChild(SpanElement(token));
      }
    });
    paragraph.appendChild(document.createElement('br'));
  });

  // For each child node render a subtree and append it to the current element
  blockNode.children.forEach(function(childBlockNode) {
    var childElement = renderTree(childBlockNode);
    section.appendChild(childElement);
  });

  return section;
}

function SpanElement(token) {
  var textNode = document.createTextNode(token.text);
  var spanElement = document.createElement('span');
  spanElement.appendChild(textNode);
  return spanElement;
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

function IcLinkElement(token) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = token.id + '/';
  linkElement.href = '#' + token.id + '/';
  linkElement.dataset.type = 'ic';
  linkElement.classList.add('ic-link');
  return linkElement;
}
