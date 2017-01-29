function SectionElementTree(paragraphNode, level) {
  var section = document.createElement('section');
  var paragraph = document.createElement('p');
  section.appendChild(paragraph);
  hideSectionElement(section);

  paragraphNode.lines.forEach(function(line) {
    line.tokens.forEach(function(token) {
      var element = linkConstructorForTokenType[token.type](token, level);
      paragraph.appendChild(element);
    });

    paragraph.appendChild(document.createElement('br'));
  });

  paragraphNode.children.forEach(function(childParagraphNode) {
    var childElement = SectionElementTree(childParagraphNode, level + 1);
    section.appendChild(childElement);
  });

  return section;
}

var linkConstructorForTokenType = {
  'text': SpanElement,
  'parent': ParentLinkElement,
  'alias': AliasLinkElement,
  'ic': IcLinkElement,
  'url': UrlLinkElement
}

function SpanElement(token) {
  var textNode = document.createTextNode(token.text);
  var spanElement = document.createElement('span');
  spanElement.appendChild(textNode);
  return spanElement;
}

function IcLinkElement(token, level) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.text) + '/';
  linkElement.href = '#' + displayHashFor(token.text) + '/';
  linkElement.dataset.displayHash = displayHashFor(token.text) + '/';
  linkElement.dataset.type = 'ic';
  linkElement.dataset.level = level;
  linkElement.classList.add('moss-ic-link');
  linkElement.classList.add('level-' + level);
  return linkElement;
}

function ParentLinkElement(token, level) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.text);
  linkElement.href = '#' + displayHashFor(token.text);
  linkElement.dataset.displayHash = displayHashFor(token.text);
  linkElement.dataset.type = 'parent';
  linkElement.dataset.level = level;
  linkElement.classList.add('moss-parent-link');
  linkElement.classList.add('level-' + level);

  return linkElement;
}

function AliasLinkElement(token, level) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.clause);
  linkElement.dataset.displayHash = displayHashFor(capitalize(token.clause));
  linkElement.href = '#' + displayHashFor(capitalize(token.text));
  linkElement.dataset.type = 'alias';
  linkElement.dataset.level = level;
  linkElement.classList.add('moss-alias-link');
  linkElement.classList.add('level-' + level);

  return linkElement;
}

function UrlLinkElement(token, level) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.url));
  linkElement.id = htmlIdFor(token.text);
  linkElement.href = token.url;
  linkElement.setAttribute('target', '_blank');
  linkElement.dataset.type = 'url';
  linkElement.dataset.level = level;
  linkElement.dataset.displayHash = displayHashFor(icOf(token.text));
  linkElement.classList.add('moss-url-link');
  linkElement.classList.add('level-' + level);

  return linkElement;
}
