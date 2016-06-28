(function () {
  'use strict';

  describe('Moss', function () {
    it('exists', function () {
      expect(!!Moss).toBe(true);
    });

    it('builds a single-node AST', function() {
      var AST = Moss('Hello world.');
      expect(AST.text).toBe('Hello world.');
      expect(AST.id).toBe('Hello_world');
      expect(AST.constructor).toBe(BlockNode);
      expect(AST.children).toEqual([]);

      expect(AST.lines[0].constructor).toBe(Line);
      expect(AST.lines[0].text).toBe('Hello world.');

      expect(AST.lines[0].tokens[0].constructor).toBe(LinkToken);
      expect(AST.lines[0].tokens[0].type).toBe('ic');
      expect(AST.lines[0].tokens[0].text).toBe('Hello world');
    });

    it('supports primary links', function() {
      var dataString =
        "Moss is a library for generating explanation trees.\n" +
        "Explanation trees have various benefits.\n" +
        "\n" +
        "Explanation trees have various benefits.\n" +
        "They can have different branches.";

      var AST = Moss(dataString);

      expect(AST.text).toBe(
          "Moss is a library for generating explanation trees.\n" +
          "Explanation trees have various benefits."
        );
      expect(AST.constructor).toBe(BlockNode);
      expect(AST.id).toBe('Moss_is_a_library_for_generating_explanation_trees');
      expect(AST.children.length).toBe(1);

      expect(AST.lines[0].constructor).toBe(Line);
      expect(AST.lines[0].text).toBe('Moss is a library for generating explanation trees.');
      expect(AST.lines[0].tokens[0].constructor).toBe(LinkToken);
      expect(AST.lines[0].tokens[0].type).toBe('ic');
      expect(AST.lines[0].tokens[0].text).toBe('Moss is a library for generating explanation trees');
      expect(AST.lines[0].tokens[1].constructor).toBe(PunctuationToken);
      expect(AST.lines[0].tokens[1].text).toBe('.');

      expect(AST.lines[1].constructor).toBe(Line);
      expect(AST.lines[1].text).toBe('Explanation trees have various benefits.');
      expect(AST.lines[1].tokens[0].constructor).toBe(LinkToken);
      expect(AST.lines[1].tokens[0].type).toBe('primary');
      expect(AST.lines[1].tokens[0].text).toBe('Explanation trees have various benefits');
      expect(AST.lines[1].tokens[1].constructor).toBe(PunctuationToken);
      expect(AST.lines[1].tokens[1].text).toBe('.');

      expect(AST.children[0].constructor).toBe(BlockNode);
      expect(AST.children[0].text).toBe("Explanation trees have various benefits.\nThey can have different branches.");
      expect(AST.children[0].id).toBe('Explanation_trees_have_various_benefits');
      expect(AST.children[0].children.length).toBe(0);

      expect(AST.children[0].lines[0].constructor).toBe(Line);
      expect(AST.children[0].lines[0].text).toBe("Explanation trees have various benefits.");
      expect(AST.children[0].lines[0].tokens[0].constructor).toBe(LinkToken);
      expect(AST.children[0].lines[0].tokens[0].text).toBe("Explanation trees have various benefits");
      expect(AST.children[0].lines[0].tokens[0].type).toBe("ic");
      expect(AST.children[0].lines[0].tokens[1].constructor).toBe(PunctuationToken);
      expect(AST.children[0].lines[0].tokens[1].text).toBe('.');

      expect(AST.children[0].lines[1].constructor).toBe(Line);
      expect(AST.children[0].lines[1].text).toBe("They can have different branches.");
      expect(AST.children[0].lines[1].tokens[0].constructor).toBe(TextToken);
      expect(AST.children[0].lines[1].tokens[0].text).toBe("They");
      expect(AST.children[0].lines[1].tokens[1].constructor).toBe(TextToken);
      expect(AST.children[0].lines[1].tokens[1].text).toBe("can");
      expect(AST.children[0].lines[1].tokens[2].constructor).toBe(TextToken);
      expect(AST.children[0].lines[1].tokens[2].text).toBe("have");
      expect(AST.children[0].lines[1].tokens[3].constructor).toBe(TextToken);
      expect(AST.children[0].lines[1].tokens[3].text).toBe("different");
      expect(AST.children[0].lines[1].tokens[4].constructor).toBe(TextToken);
      expect(AST.children[0].lines[1].tokens[4].text).toBe("branches");
      expect(AST.children[0].lines[1].tokens[5].constructor).toBe(PunctuationToken);
      expect(AST.children[0].lines[1].tokens[5].text).toBe('.');
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

      var AST = Moss(dataString);

      expect(AST.text).toBe(
        "Moss is a library for generating explanation trees.\n" +
        "Explanation trees have various benefits.\n" +
        "Explanation trees have various use cases."
        );
      expect(AST.constructor).toBe(BlockNode);
      expect(AST.id).toBe('Moss_is_a_library_for_generating_explanation_trees');
      expect(AST.children.length).toBe(2);

      expect(AST.lines[0].constructor).toBe(Line);
      expect(AST.lines[0].text).toBe('Moss is a library for generating explanation trees.');
      expect(AST.lines[0].tokens[0].constructor).toBe(LinkToken);
      expect(AST.lines[0].tokens[0].type).toBe('ic');
      expect(AST.lines[0].tokens[0].text).toBe('Moss is a library for generating explanation trees');
      expect(AST.lines[0].tokens[1].constructor).toBe(PunctuationToken);
      expect(AST.lines[0].tokens[1].text).toBe('.');

      expect(AST.lines[1].constructor).toBe(Line);
      expect(AST.lines[1].text).toBe('Explanation trees have various benefits.');
      expect(AST.lines[1].tokens[0].constructor).toBe(LinkToken);
      expect(AST.lines[1].tokens[0].type).toBe('primary');
      expect(AST.lines[1].tokens[0].text).toBe('Explanation trees have various benefits');
      expect(AST.lines[1].tokens[1].constructor).toBe(PunctuationToken);
      expect(AST.lines[1].tokens[1].text).toBe('.');

      expect(AST.lines[2].constructor).toBe(Line);
      expect(AST.lines[2].text).toBe('Explanation trees have various use cases.');
      expect(AST.lines[2].tokens[0].constructor).toBe(LinkToken);
      expect(AST.lines[2].tokens[0].type).toBe('primary');
      expect(AST.lines[2].tokens[0].text).toBe('Explanation trees have various use cases');
      expect(AST.lines[2].tokens[1].constructor).toBe(PunctuationToken);
      expect(AST.lines[2].tokens[1].text).toBe('.');

      expect(AST.children[1].constructor).toBe(BlockNode);
      expect(AST.children[1].text).toBe(
        "Explanation trees have various use cases.\n" +
        "This is like how explanation trees have various benefits."
      );
      expect(AST.children[1].id).toBe('Explanation_trees_have_various_use_cases');
      expect(AST.children[1].children.length).toBe(0);

      expect(AST.children[1].lines[0].constructor).toBe(Line);
      expect(AST.children[1].lines[0].text).toBe('Explanation trees have various use cases.');
      expect(AST.children[1].lines[0].tokens[0].constructor).toBe(LinkToken);
      expect(AST.children[1].lines[0].tokens[0].text).toBe('Explanation trees have various use cases');
      expect(AST.children[1].lines[0].tokens[0].type).toBe('ic');
      expect(AST.children[1].lines[0].tokens[1].constructor).toBe(PunctuationToken);
      expect(AST.children[1].lines[0].tokens[1].text).toBe('.');

      expect(AST.children[1].lines[1].constructor).toBe(Line);
      expect(AST.children[1].lines[1].text).toBe('This is like how explanation trees have various benefits.');
      expect(AST.children[1].lines[1].tokens[0].constructor).toBe(TextToken);
      expect(AST.children[1].lines[1].tokens[0].text).toBe("This");
      expect(AST.children[1].lines[1].tokens[1].constructor).toBe(TextToken);
      expect(AST.children[1].lines[1].tokens[1].text).toBe("is");
      expect(AST.children[1].lines[1].tokens[2].constructor).toBe(TextToken);
      expect(AST.children[1].lines[1].tokens[2].text).toBe("like");
      expect(AST.children[1].lines[1].tokens[3].constructor).toBe(TextToken);
      expect(AST.children[1].lines[1].tokens[3].text).toBe("how");
      expect(AST.children[1].lines[1].tokens[4].constructor).toBe(LinkToken);
      expect(AST.children[1].lines[1].tokens[4].text).toBe('explanation trees have various benefits');
      expect(AST.children[1].lines[1].tokens[4].type).toBe('secondary');
      expect(AST.children[1].lines[1].tokens[5].constructor).toBe(PunctuationToken);
      expect(AST.children[1].lines[1].tokens[5].text).toBe('.');
    });
  });
})();
