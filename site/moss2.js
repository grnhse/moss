function Moss(dataString) {
  var ics = {};
  var icTreeNodes = {};
  dataString.split(/\n\n+(?=.)/).forEach(function(block) {
    ics[icOf(block)] = true;
    icTreeNodes[icOf(block)] = parseBlock(block);
  });

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
    lineNode.clauses = [];
    var clauseStrings = line.match(/([^.?!;:,]+[.?!;:,])/g);
    lineNode.clauses.push({type: 'clause', text: clauseStrings[0], tokens: [IcToken(clauseStrings[0])]});
    lineNode.clauses.concat(clauseStrings.slice(1).map(parseClause.bind({}, ic)));
    if (!lineNode.clauses) { throw "Invalid line: " + line; }
    return lineNode;
  }

  function parseClause(ic, clause) {
    var clauseNode = {type: 'clause', text: clause};
    var tokens = [];
    var terminalPunctuation = clause.match(/[.!?)'":;,]+$/)[0];
    var words = clause.slice(0, -terminalPunctuation.length).split(' ');

    while (words.length > 0) {
      (function(tokens) {
      for (var i = words.length; i > 0; i--) {
        var substring = words.slice(0, i).join(' ');
        if (ics.hasOwnProperty(substring.toLowerCase())) {
          tokens.push(LinkToken(substring));
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
    var clauseNodeArray = [].concat.apply([], parentNode.lines.map(function(lineNode){return lineNode.clauses}));
    var tokens = [].concat.apply([], clauseNodeArray.map(function(clauseNode){return clauseNode.tokens}));
    var linkTokens = tokens.filter(function(token){return token.type === 'link'});
    debugger;

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
    return icBlocks;
  }

  function icOf(string) {
    return string.split(/[,.:;?!]/)[0].toLowerCase();
  }
}
