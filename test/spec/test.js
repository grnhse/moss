(function () {
  'use strict';

  describe('Moss', function () {
    it('should exist', function () {
      expect(!!Moss).toBe(true);
    });
    it('should build a single-node AST', function() {
      var AST = Moss('Hello world.');
      console.log(AST);
      expect(AST.text).toBe('Hello world.');
      expect(AST.constructor).toBe(BlockNode);
      expect(AST.children).toEqual([]);

      expect(AST.lines[0].constructor).toBe(LineNode);
      expect(AST.lines[0].text).toBe('Hello world.');

      expect(AST.lines[0].tokens[0].constructor).toBe(LinkToken);
      expect(AST.lines[0].tokens[0].type).toBe('ic');
      expect(AST.lines[0].tokens[0].text).toBe('Hello world');
      expect(AST.lines[0].tokens[0].ic).toBe('hello world');
    });
  });
})();
