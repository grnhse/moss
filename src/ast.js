function ParagraphNodeTree(dataString) {
  var paragraphStrings = splitOnDoubleNewline(dataString);
  var icParagraphNodes = generateParagraphNodes(paragraphStrings);
  var tree = assembleTreeFromNodes(icOf(dataString), icParagraphNodes);

  return tree;
}

function generateParagraphNodes(paragraphStrings) {
  var ics = icsOfParagraphStrings(paragraphStrings);
  printIcsForDebugging(ics);

  return paragraphStrings.
    slice().
    reverse().
    reduce(function(icParagraphNodes, paragraphString){
      var ic = icOf(paragraphString);
      icParagraphNodes[ic] = new ParagraphNode(
        paragraphString,
        ics,
        icParagraphNodes
      );

      return icParagraphNodes;
    }, {});
}

function ParagraphNode(paragraphString, ics, icParagraphNodes) {
  var paragraphNode = this;
  paragraphNode.text = paragraphString;
  paragraphNode.children = [];
  paragraphNode.lines = generateLinesObjects(
    paragraphString,
    ics,
    {
      isParentMatch: function(match) {
        return icParagraphNodes.hasOwnProperty(match);
      },
      onParentMatch: function(match) {
        paragraphNode.children.push(icParagraphNodes[match]);
        delete icParagraphNodes[match];
      }
    }
  );
}

function generateLinesObjects(paragraphString, ics, callbacks) {
  return paragraphString.
    split(/\n/).
    reduce(function(lineObjects, lineText, lineIndex) {
      var lineObject = new Line(
        lineText,
        lineIndex === 0,
        icOf(paragraphString),
        ics,
        callbacks
      );

      lineObjects.push(lineObject);
      return lineObjects;
    }, []);
}

function Line(lineText, isFirstLineOfBlock, currentIc, ics, callbacks) {
  var lineObject = this;
  lineObject.text = lineText;
  lineObject.tokens = clausesWithPunctuationOf(lineText).
    reduce(function(tokens, clause, clauseIndex){
      var newTokens = tokensForClause(
        clause,
        isFirstLineOfBlock && clauseIndex === 0,
        currentIc,
        ics,
        callbacks
      );

      addToArray(tokens, newTokens);
      return tokens;
    }, []);
}

function tokensForClause(clause, isIcClause, currentIc, ics, callbacks) {
  if (isIcClause) {
    return [new IcToken(clause)];
  } else {
    return parseClause(
      clause,
      currentIc,
      ics,
      callbacks
    );
  }
}

function assembleTreeFromNodes(rootIc, icParagraphNodes) {
  var rootNode = icParagraphNodes[rootIc];
  delete icParagraphNodes[rootIc];
  printDebugInfo(rootNode, icParagraphNodes);
  return rootNode;
}

function printDebugInfo(rootNode, icParagraphNodes) {
  if (debugEnabled()) {
    console.log('');
    console.log("AST:", rootNode);
    if (Object.keys(icParagraphNodes).length) {
      console.log('');
      console.log("Orphan list:");
      for (var ic in icParagraphNodes) {
        console.log(icParagraphNodes[ic].text);
      }
    }
  }
}

function addToArray(array, newItems) {
  return Array.prototype.push.apply(array, newItems);
}

