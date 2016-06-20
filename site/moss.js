function Moss(dataString) {
  var icBlockNodes = {};
  var ics = {};
  dataString.split(/\n\n+/).forEach(function(block) {
    icBlockNodes[icOf(block)] = BlockNode(block);
    ics[icOf(block)] = icOf(block);
  });

  var ast = assembleTree(icBlockNodes[icOf(dataString)], icBlockNodes)
  return ast;
}

function BlockNode(block) {
  this.lines = block.split('\n').map(LineNode);
  this.children = [];
}

function LineNode(line) {
  this.tokens = [];
  line.match(/ ?([^,.:;?!)'"]+[,.:;?!)'"]+)/).forEach(clauseWithPunctuation) {
    var puctuation = clauseWithPuctuation.match(/[,.:;?!)'"]+/);
    var clause = clauseWithPunctuation.slice(0, -punctuation.length);
    var words = clause.split(' ');
    while (words.length > 0) {
      next_prefix:
      for (var i = words.length; i > 0; i--) {
        var substring = words.slice(0, i).join(' ');
        if (ics.hasOwnProperty(substring.toLowerCase())) {
          this.tokens.push(LinkToken(substring));
          words = words.slice(i);
          break next_prefix;
        }
        var word = words.shift();
        tokens.push(TextToken(word));
      }
    }
  }
}

function assembleTree(parentNode, icBlockNodes) {
  parentNode.lines.forEach(lineNode) {
    lineNode.tokens.filter(function(token){token.constructor === LinkToken}).forEach(function(linkToken, index) {
      if (index === 0) {
        linkToken.type = 'ic';
      } else if (icBlockNodes.hasOwnProperty(linkToken.text.toLowerCase())) {
        parentNode.children.push(icBlockNodes[]);
        delete icBlockNodes[linkToken.ic];
        linkToken.type = 'primary'
      } else {
        linkToken.type = 'secondary'
      }
    });
  }

  parentNode.children.forEach(function(childNode) {
    assembleTree(childNode, icBlockNodes);
  });
}

function TextToken(text) {
  this.text = text;
}

function LinkToken(text) {
  this.text = text;
  this.ic = text.toLowerCase();
}

function icOf(string) {
  block.split(/[,.;:]/)[0].toLowerCase();
}
