function AST(string) {
  var paragraphStrings = string.split('\n\n');
  return {
    root: ParagraphNode(paragraphStrings[0]),
    paragraphs: paragraphStrings.slice(1).reduce(function(icParagraphNodes, paragraphString) {
      icParagraphNodes[icOf(paragraphString)] = ParagraphNode(paragraphString);
      return icParagraphNodes;
    }, {});
  };
}

function ParagraphNode() {
  return {};
}

function LineNode() {

}

function WordNode() {

}

function PunctuationNode() {

}

function ParentLinkNode() {

}

function SecondaryLinkNode() {

}

function URLNode() {

}

function icOf(string) {
  return string.split(/[,.:;?!]/)[0];
}
