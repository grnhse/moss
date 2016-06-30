(function () {
  'use strict';

  describe('renderTree', function () {
    it('exists', function () {
      expect(!!renderTree).toBe(true);
    });

    it('builds a single-node AST', function() {
      var AST = Moss('Hello world.');
      var rootElement = renderTree(AST);

      expect(rootElement.tagName).toBe('SECTION');
      expect(rootElement.innerText).toBe(' Hello world.');
      expect(rootElement.id).toBe('Hello_world');
      expect(rootElement.childNodes.length).toBe(1);

      expect(rootElement.childNodes[0].tagName).toBe('P');
      expect(rootElement.childNodes[0].innerText).toBe(' Hello world.');
      expect(rootElement.childNodes[0].childNodes[0].data).toBe(' ');
      expect(rootElement.childNodes[0].childNodes[1].tagName).toBe('A');
      expect(rootElement.childNodes[0].childNodes[1].classList.contains('ic-link')).toBe(true);
      expect(rootElement.childNodes[0].childNodes[1].innerText).toBe('Hello world');
      expect(rootElement.childNodes[0].childNodes[2].data).toBe('.');
    });

    it('supports primary links', function() {
      var dataString =
        "Moss is a library for generating explanation trees.\n" +
        "Explanation trees have various benefits.\n" +
        "\n" +
        "Explanation trees have various benefits.\n" +
        "They can have different branches.";

      var AST = Moss(dataString);
      var rootElement = renderTree(AST);

      expect(rootElement.tagName).toBe('SECTION');
      expect(rootElement.id).toBe('Moss_is_a_library_for_generating_explanation_trees');
      expect(rootElement.childNodes.length).toBe(2);

      expect(rootElement.childNodes[0].tagName).toBe('P');
      expect(rootElement.childNodes[0].innerText).toBe(" Moss is a library for generating explanation trees. Explanation trees have various benefits.");
      expect(rootElement.childNodes[0].childNodes[0].data).toBe(' ');
      expect(rootElement.childNodes[0].childNodes[1].tagName).toBe('A');
      expect(rootElement.childNodes[0].childNodes[1].innerText).toBe('Moss is a library for generating explanation trees');
      expect(rootElement.childNodes[0].childNodes[1].classList.contains('ic-link')).toBe(true);
      expect(rootElement.childNodes[0].childNodes[2].data).toBe('.');
      expect(rootElement.childNodes[0].childNodes[3].data).toBe(' ');
      expect(rootElement.childNodes[0].childNodes[4].tagName).toBe('A');
      expect(rootElement.childNodes[0].childNodes[4].innerText).toBe('Explanation trees have various benefits');
      expect(rootElement.childNodes[0].childNodes[5].data).toBe('.');

      expect(rootElement.childNodes[1].tagName).toBe('SECTION');
      expect(rootElement.childNodes[1].id).toBe('Explanation_trees_have_various_benefits');
      expect(rootElement.childNodes[1].childNodes.length).toBe(1);
      expect(rootElement.childNodes[1].childNodes[0].tagName).toBe('P');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[0].data).toBe(' ');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[1].tagName).toBe('A');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[1].classList.contains('ic-link')).toBe(true);
      expect(rootElement.childNodes[1].childNodes[0].childNodes[1].innerText).toBe('Explanation trees have various benefits');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[2].data).toBe('.');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[3].data).toBe(' ');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[4].data).toBe('They');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[5].data).toBe(' ');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[6].data).toBe('can');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[7].data).toBe(' ');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[8].data).toBe('have');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[9].data).toBe(' ');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[10].data).toBe('different');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[11].data).toBe(' ');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[12].data).toBe('branches');
      expect(rootElement.childNodes[1].childNodes[0].childNodes[13].data).toBe('.');
    });

    it('supports secondary links', function() {
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

      var AST = Moss(dataString);
      var rootElement = renderTree(AST);

      var derivationBox = document.createElement('div')
      derivationBox.id = '_derivation';
      derivationBox.style.display = 'none';
      document.body.appendChild(derivationBox);

      expect(document.getElementById('_derivation').childNodes.length).toBe(0);
      expect(rootElement.childNodes[2].childNodes[0].childNodes[12].tagName).toBe('A');
      expect(rootElement.childNodes[2].childNodes[0].childNodes[12].innerText).toBe('explanation trees can have different branches');

      rootElement.childNodes[2].childNodes[0].childNodes[12].click();

      expect(document.getElementById('_derivation').childNodes.length).toBe(1);
      expect(document.getElementById('_derivation').childNodes[0].tagName).toBe('P');
      expect(document.getElementById('_derivation').childNodes[0].childNodes[0].data).toBe('(');
      expect(document.getElementById('_derivation').childNodes[0].childNodes[1].innerText).toBe('Explanation trees have various benefits.');
      expect(document.getElementById('_derivation').childNodes[0].childNodes[2].data).toBe(' ');
      expect(document.getElementById('_derivation').childNodes[0].childNodes[3].innerText).toBe('Explanation trees can have different branches.');
      expect(document.getElementById('_derivation').childNodes[0].childNodes[4].data).toBe(')');

      document.getElementById('_derivation').childNodes[0].childNodes[1].childNodes[0].click();

      expect(document.getElementById('_derivation').childNodes.length).toBe(2);
      expect(document.getElementById('_derivation').childNodes[1].childNodes[0].data).toBe('(');
      expect(document.getElementById('_derivation').childNodes[1].childNodes[1].innerText).toBe('Moss is a library for generating explanation trees.');
      expect(document.getElementById('_derivation').childNodes[1].childNodes[2].data).toBe(' ');
      expect(document.getElementById('_derivation').childNodes[1].childNodes[3].innerText).toBe('Explanation trees have various benefits.');
      expect(document.getElementById('_derivation').childNodes[1].childNodes[4].data).toBe(')');
    });
  });
})();
