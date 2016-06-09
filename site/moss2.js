function Moss(dataString) {
  var icBlocks = IcBlocks(dataString);
  var parsedBlocks = dataString.split(/\n\n+(?=.)/).map(parseBlock);

  function parseBlock(block) {
    return block.split(/\n(?=.)/).map(parseLine);
  }

  function parseLine(line) {
    return line.match(/([^.?!;:,]+[.?!;:,])/g).map(parseClause);
  }

  function parseClause(clause) {
    var tokens = [];
    var terminalPunctuation = clause.match(/[.!?)'":;,]+$/)[0];
    var words = clause.slice(0, -terminalPunctuation.length).split(' ');

    while (words.length > 0) {
      (function(tokens){
      for (var i = words.length; i > 0; i--) {
        var substring = words.slice(0, i).join(' ');
        if (icBlocks.hasOwnProperty(substring.toLowerCase())) {
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

    return tokens;
  }

  function WordToken(string) {
    return string;
  }

  function LinkToken(string) {
    return string.toUpperCase();
  }

  function PunctuationToken(string) {
    return string;
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
