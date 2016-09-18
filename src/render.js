function SectionElementTree(paragraphNode) {
  var section = document.createElement('section');
  var paragraph = document.createElement('p');
  section.appendChild(paragraph);
  hideSectionElement(section);

  paragraphNode.lines.forEach(function(line) {
    line.tokens.forEach(function(token) {
      var element = linkConstructorForTokenType[token.type](token);
      paragraph.appendChild(element);
    });

    paragraph.appendChild(document.createElement('br'));
  });

  paragraphNode.children.forEach(function(childParagraphNode) {
    var childElement = SectionElementTree(childParagraphNode);
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

function IcLinkElement(token) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.text) + '/';
  linkElement.href = '#' + displayHashFor(token.text) + '/';
  linkElement.dataset.displayHash = displayHashFor(token.text) + '/';
  linkElement.dataset.type = 'ic';
  linkElement.classList.add('moss-ic-link');
  return linkElement;
}

function ParentLinkElement(token) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.text);
  linkElement.href = '#' + displayHashFor(token.text);
  linkElement.dataset.displayHash = displayHashFor(token.text);
  linkElement.dataset.type = 'parent';
  linkElement.classList.add('moss-parent-link');

  return linkElement;
}

function AliasLinkElement(token) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.text));
  linkElement.id = htmlIdFor(token.clause);
  linkElement.dataset.displayHash = displayHashFor(capitalize(token.clause));
  linkElement.href = '#' + displayHashFor(capitalize(token.text));
  linkElement.dataset.type = 'alias';
  linkElement.classList.add('moss-alias-link');
  return linkElement;
}

function UrlLinkElement(token) {
  var linkElement = document.createElement('a');
  linkElement.appendChild(document.createTextNode(token.url));
  linkElement.id = htmlIdFor(token.text);
  linkElement.href = token.url;
  linkElement.setAttribute('target', '_blank');
  linkElement.dataset.type = 'url';
  linkElement.dataset.displayHash = displayHashFor(icOf(token.text));
  linkElement.classList.add('moss-url-link');
  return linkElement;
}
