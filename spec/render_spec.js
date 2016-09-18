(function () {
  'use strict';

  describe('SectionElementTree', function () {
    it('exists', function () {
      expect(SectionElementTree instanceof Function).toBe(true);
    });

    it('builds a single-node tree', function() {
      var ast = ParagraphNodeTree('Hello world.');
      var rootElement = SectionElementTree(ast);

      expect(rootElement.tagName).toBe('SECTION');
      expect(rootElement.textContent).toBe('Hello world.');
      expect(rootElement.childNodes.length).toBe(1);

      expect(rootElement.childNodes[0].tagName).toBe('P');
      expect(rootElement.childNodes[0].textContent).toBe('Hello world.');
      expect(rootElement.childNodes[0].childNodes[0].tagName).toBe('A');
      expect(rootElement.childNodes[0].childNodes[0].textContent).toBe('Hello world.');
      expect(rootElement.childNodes[0].childNodes[0].id).toBe('_moss_Hello_world/');
    });

    it('supports parent links', function() {
      var dataString =
        "Moss is a library for generating explanation trees.\n" +
        "Explanation trees have various benefits.\n" +
        "\n" +
        "Explanation trees have various benefits.\n" +
        "They can have different branches.";

      var ast = ParagraphNodeTree(dataString);
      var rootElement = SectionElementTree(ast);

      expect(rootElement.tagName).toBe('SECTION');
      expect(rootElement.childNodes.length).toBe(2);

      expect(rootElement.childNodes[0].tagName).toBe('P');
      expect(rootElement.childNodes[0].textContent).toBe(
        "Moss is a library for generating explanation trees." +
        "Explanation trees have various benefits.");
      expect(rootElement.childNodes[0].childNodes[0].tagName).toBe('A');
      expect(rootElement.childNodes[0].childNodes[0].id).toBe('_moss_Moss_is_a_library_for_generating_explanation_trees/');
      expect(rootElement.childNodes[0].childNodes[0].textContent).toBe('Moss is a library for generating explanation trees.');
      expect(rootElement.childNodes[0].childNodes[1].tagName).toBe('BR');
      expect(rootElement.childNodes[0].childNodes[2].tagName).toBe('A');
      expect(rootElement.childNodes[0].childNodes[2].textContent).toBe('Explanation trees have various benefits.');

      expect(rootElement.childNodes[1].tagName).toBe('SECTION');
      expect(rootElement.childNodes[1].childNodes.length).toBe(1);
      expect(rootElement.childNodes[1].childNodes[0].tagName).toBe('P');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[0].tagName).toBe('A');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[0].id).toBe('_moss_Explanation_trees_have_various_benefits/');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[0].textContent).toBe('Explanation trees have various benefits.');
      expect(Array.prototype.slice.call(rootElement.childNodes[1].childNodes[0].childNodes, 2, 12).map(function(node){return node.textContent}).join('')).toBe('They can have different branches.');
    });

    it('supports alias links', function() {
      var dataString =
        "Moss is a library for generating explanation trees.\n" +
        "Explanation trees have various benefits.\n" +
        "Explanation trees have various use cases.\n" +
        "\n" +
        "Explanation trees have various benefits.\n" +
        "Explanation trees can have different branches.\n" +
        "\n" +
        "Explanation trees can have different branches.\n" +
        "They can have very many of them.\n" +
        "\n" +
        "Explanation trees have various use cases.\n" +
        "This is like how explanation trees can have different branches.\n";

      var ast = ParagraphNodeTree(dataString);
      var rootElement = SectionElementTree(ast);

      expect(rootElement.childNodes[2].childNodes[0].childNodes[10].tagName).toBe('A');
      expect(rootElement.childNodes[2].childNodes[0].childNodes[10].id).toBe("_moss_This_is_like_how_explanation_trees_can_have_different_branches");
      expect(rootElement.childNodes[2].childNodes[0].childNodes[10].classList.contains('moss-alias-link')).toBe(true);
      expect(rootElement.childNodes[2].childNodes[0].childNodes[10].href.split('#')[1]).toBe("Explanation_trees_can_have_different_branches");
    });
  });
})();
