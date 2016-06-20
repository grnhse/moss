function Moss(dataString) {
  var icBlockNodes = {};
  var ics = {};
  dataString.split(/\n\n+(?=.)/).forEach(function(block) {
    ics[icOf(block)] = icOf(block);
  });

  dataString.split(/\n\n+(?=.)/).forEach(function(block) {
    icBlockNodes[icOf(block)] = new BlockNode(block);
  });

  var ast = assembleTree(icBlockNodes[icOf(dataString)], icBlockNodes);
  return ast;

  function BlockNode(block) {
    this.text = block;
    this.lines = block.trim().split('\n').map(function(block) { return new LineNode(block);});
    this.children = [];
  }

  function LineNode(line) {
    this.text = line;
    var lineNode = this;
    lineNode.tokens = [];
    line.match(/ ?([^,.:;?!)'"]+[,.:;?!)'"]+)/g).forEach(function(clauseWithPunctuation) {
      var punctuation = clauseWithPunctuation.match(/[,.:;?!)'"]+/);
      var clause = clauseWithPunctuation.slice(0, -punctuation.length);
      var words = clause.split(' ');
      while (words.length > 0) {
        next_while_loop:
        for (var i = words.length; i > 0; i--) {
          var substring = words.slice(0, i).join(' ');
          if (ics.hasOwnProperty(substring.toLowerCase())) {
            lineNode.tokens.push(new LinkToken(substring));
            words = words.slice(i);
            break next_while_loop;
          }
          var word = words.shift();
          lineNode.tokens.push(new TextToken(word));
        }
      }
    });
  }

  function assembleTree(parentNode, icBlockNodes) {
    parentNode.lines.forEach(function(lineNode, lineIndex) {
      lineNode.tokens.filter(function(token){return token.constructor === LinkToken}).forEach(function(linkToken, tokenIndex) {
        if (lineIndex === 0 && tokenIndex === 0) {
          linkToken.type = 'ic';
        } else if (icBlockNodes.hasOwnProperty(linkToken.ic)) {
          parentNode.children.push(icBlockNodes[linkToken.ic]);
          delete icBlockNodes[linkToken.ic];
          linkToken.type = 'primary'
        } else {
          linkToken.type = 'secondary'
        }
      });
    });

    parentNode.children.forEach(function(childNode) {
      assembleTree(childNode, icBlockNodes);
    });

    return parentNode;
  }

  function TextToken(text) {
    this.text = text;
  }

  function LinkToken(text) {
    this.text = text;
    this.ic = text.toLowerCase();
  }

  function icOf(string) {
    return string.split(/[,.;:?!]/)[0].toLowerCase();
  }
}
