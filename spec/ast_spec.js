(function () {
  'use strict';
  var debug = false;

  describe('ParagraphNodeTree', function () {
    it('is defined', function () {
      expect(ParagraphNodeTree instanceof Function).toBe(true);
    });

    it('builds a single-node AST', function() {
      var tree = ParagraphNodeTree('Hello world.');
      expect(tree.text).toBe('Hello world.');
      expect(tree.constructor).toBe(ParagraphNode);
      expect(tree.children).toEqual([]);

      expect(tree.lines[0].constructor).toBe(Line);
      expect(tree.lines[0].text).toBe('Hello world.');

      expect(tree.lines[0].tokens[0].constructor).toBe(IcToken);
      expect(tree.lines[0].tokens[0].text).toBe('Hello world.');
    });

    it('supports parent links', function() {
      var dataString =
        "Moss is a library for generating explanation trees.\n" +
        "Explanation trees have various benefits.\n" +
        "\n" +
        "Explanation trees have various benefits.\n" +
        "They can have different branches.";

      var tree = ParagraphNodeTree(dataString);

      expect(tree.text).toBe(
          "Moss is a library for generating explanation trees.\n" +
          "Explanation trees have various benefits."
        );
      expect(tree.constructor).toBe(ParagraphNode);
      expect(tree.children.length).toBe(1);

      expect(tree.lines[0].constructor).toBe(Line);
      expect(tree.lines[0].text).toBe('Moss is a library for generating explanation trees.');
      expect(tree.lines[0].tokens[0].constructor).toBe(IcToken);
      expect(tree.lines[0].tokens[0].text).toBe('Moss is a library for generating explanation trees.');

      expect(tree.lines[1].constructor).toBe(Line);
      expect(tree.lines[1].text).toBe('Explanation trees have various benefits.');
      expect(tree.lines[1].tokens[0].constructor).toBe(ParentToken);
      expect(tree.lines[1].tokens[0].text).toBe('Explanation trees have various benefits.');

      expect(tree.children[0].constructor).toBe(ParagraphNode);
      expect(tree.children[0].text).toBe("Explanation trees have various benefits.\nThey can have different branches.");
      expect(tree.children[0].children.length).toBe(0);

      expect(tree.children[0].lines[0].constructor).toBe(Line);
      expect(tree.children[0].lines[0].text).toBe("Explanation trees have various benefits.");
      expect(tree.children[0].lines[0].tokens[0].constructor).toBe(IcToken);
      expect(tree.children[0].lines[0].tokens[0].text).toBe("Explanation trees have various benefits.");

      expect(tree.children[0].lines[1].constructor).toBe(Line);
      expect(tree.children[0].lines[1].text).toBe("They can have different branches.");
      expect(tree.children[0].lines[1].tokens[0].constructor).toBe(TextToken);
      expect(tree.children[0].lines[1].tokens.map(function(token){return token.text}).join('')).
          toBe("They can have different branches.");
    });

    it('supports secondary links', function() {
      var dataString =
        "Moss is a library for generating explanation trees.\n" +
        "Explanation trees have various benefits.\n" +
        "Explanation trees have various use cases.\n" +
        "\n" +
        "Explanation trees have various benefits.\n" +
        "They can have different branches.\n" +
        "\n" +
        "Explanation trees have various use cases.\n" +
        "This is like how explanation trees have various benefits.\n";

      var tree = ParagraphNodeTree(dataString);

      expect(tree.text).toBe(
        "Moss is a library for generating explanation trees.\n" +
        "Explanation trees have various benefits.\n" +
        "Explanation trees have various use cases."
        );
      expect(tree.constructor).toBe(ParagraphNode);
      expect(tree.children.length).toBe(2);

      expect(tree.lines[0].constructor).toBe(Line);
      expect(tree.lines[0].text).toBe('Moss is a library for generating explanation trees.');
      expect(tree.lines[0].tokens[0].constructor).toBe(IcToken);
      expect(tree.lines[0].tokens[0].text).toBe('Moss is a library for generating explanation trees.');

      expect(tree.lines[1].constructor).toBe(Line);
      expect(tree.lines[1].text).toBe('Explanation trees have various benefits.');
      expect(tree.lines[1].tokens[0].constructor).toBe(ParentToken);
      expect(tree.lines[1].tokens[0].text).toBe('Explanation trees have various benefits.');

      expect(tree.lines[2].constructor).toBe(Line);
      expect(tree.lines[2].text).toBe('Explanation trees have various use cases.');
      expect(tree.lines[2].tokens[0].constructor).toBe(ParentToken);
      expect(tree.lines[2].tokens[0].text).toBe('Explanation trees have various use cases.');

      expect(tree.children[1].constructor).toBe(ParagraphNode);
      expect(tree.children[1].text).toBe(
        "Explanation trees have various use cases.\n" +
        "This is like how explanation trees have various benefits."
      );
      expect(tree.children[1].children.length).toBe(0);

      expect(tree.children[1].lines[0].constructor).toBe(Line);
      expect(tree.children[1].lines[0].text).toBe('Explanation trees have various use cases.');
      expect(tree.children[1].lines[0].tokens[0].constructor).toBe(IcToken);
      expect(tree.children[1].lines[0].tokens[0].text).toBe('Explanation trees have various use cases.');

      expect(tree.children[1].lines[1].constructor).toBe(Line);
      expect(tree.children[1].lines[1].text).toBe('This is like how explanation trees have various benefits.');
      expect(tree.children[1].lines[1].tokens[0].constructor).toBe(TextToken);
      expect(tree.children[1].lines[1].tokens.slice(0, 8).map(function(token){return token.text}).join('')).
        toBe("This is like how ");
      expect(tree.children[1].lines[1].tokens[8].constructor).toBe(AliasToken);
      expect(tree.children[1].lines[1].tokens[8].text).toBe('explanation trees have various benefits.');
    });
  });
})();
