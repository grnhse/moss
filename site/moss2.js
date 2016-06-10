function Moss(dataString) {
  var icBlocks = IcBlocks(dataString);
  var icTreeNodes = dataString.split(/\n\n+(?=.)/).reduce(function(icTreeNodes, blockString){
    icTreeNodes[icOf(blockString)] = parseBlock(blockString);
    return icTreeNodes;
  }, {});
  var tree = assembleTree(icTreeNodes[icOf(dataString)], icTreeNodes);
  debugger;

  function parseBlock(block) {
    return {
      type: 'block',
      lines: block.split(/\n(?=.)/).map(parseLine.bind({}, icOf(block))),
      children: [],
      text: block
    };
  }

  function parseLine(ic, line) {
    var lineNode = {type: 'line', text: line};
    lineNode.clauses = line.match(/([^.?!;:,]+[.?!;:,])/g).map(parseClause.bind({}, ic));
    return lineNode;
  }

  function parseClause(ic, clause) {
    var clauseNode = {type: 'clause', text: clause};
    var tokens = [];
    var terminalPunctuation = clause.match(/[.!?)'":;,]+$/)[0];
    var words = clause.slice(0, -terminalPunctuation.length).split(' ');

    while (words.length > 0) {
      (function(tokens){
      for (var i = words.length; i > 0; i--) {
        var substring = words.slice(0, i).join(' ');
        if (icBlocks.hasOwnProperty(substring.toLowerCase())) {
          if (substring.toLowerCase() === ic) {
            tokens.push(IcToken(substring));
          } else {
            tokens.push(LinkToken(substring));
          }
          words = words.slice(i);
          return;
        }
      }

      var word = words.shift();
      tokens.push(WordToken(word));

      })(tokens);
    }

    tokens.push(PunctuationToken(terminalPunctuation));

    clauseNode.tokens = tokens;
    return clauseNode;
  }

  function assembleTree(parentNode, icTreeNodes) {
    var lineNodeArray = parentNode.lines;
    var clauseNodeArray = [].concat.apply([], lineNodeArray.map(function(lineNode){return lineNode.clauses}));
    var tokens = [].concat.apply([], clauseNodeArray.map(function(clauseNode){return clauseNode.tokens}));
    var linkTokens = tokens.filter(function(token){return token.type === 'link'});

    linkTokens.forEach(function(linkToken){
      if (icTreeNodes.hasOwnProperty(linkToken.value.toLowerCase())) {
        parentNode.children.push(icTreeNodes[linkToken.value.toLowerCase()]);
        delete icTreeNodes[linkToken.value.toLowerCase()];
      }
    });

    parentNode.children.forEach(function(childNode){
      assembleTree(childNode, icTreeNodes);
    });

    return parentNode;
  }

  function WordToken(string) {
    return { type: 'word', value: string };
  }

  function LinkToken(string) {
    return { type: 'link', value: string };
  }

  function PunctuationToken(string) {
    return { type: 'punctuation', value: string };
  }

  function IcToken(string) {
    return { type: 'ic', value: string };
  }

  function IcBlocks(dataString) {
    var icBlocks = {};
    dataString.split(/\n\n+/).forEach(function(block){
      icBlocks[icOf(block)] = block;
    });
    return icBlocks;
  }

  function icOf(string) {
    return string.split(/[,.:;?!]/)[0].toLowerCase();
  }
}
