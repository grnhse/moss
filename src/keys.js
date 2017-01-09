var keyNames = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  72: 'h',
  76: 'l',
  75: 'k',
  74: 'j',
  73: 'i',
  32: 'space',
  13: 'return',
  9: 'tab',
  27: 'escape',
  8: 'backspace',
  78: 'n',
  66: 'b',
  84: 't',
  71: 'g',
  77: 'm',
  190: '.',
  85: 'u',
  79: 'o',
  89: 'y',
  188: ',',
  80: 'p',
  186: ';',
  219: '[',
  221: ']',
  220: '\\',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  81: 'q',
  87: 'w',
  69: 'e',
  82: 'r',
  65: 'a',
  83: 's',
  68: 'd',
  70: 'f',
  90: 'z',
  88: 'x',
  67: 'c',
  86: 'v'
}

var shortcutMovements = {
  'j': call(goDown).with({ cycle: true, collapse: false }),
  's': goDown,
  'down': call(goDown).with({ cycle: false }),
  'k': call(goUp).with({ cycle: false, collapse: true }),
  'up': call(goUp).with({ cycle: false }),
  'w': goUp,
  'h': closeParagraph,
  'a': closeParagraph,
  'left': closeParagraph,
  'l': openParagraph,
  'd': openParagraph,
  'right': openParagraph,
  'space': nextWithJump,
  'shift-space': backWithJump,
  'return': burrow,
  'shift-return': unburrow,
  'command-return': call(burrow).with({ newTab: true }),
  'ctrl-return': call(burrow).with({ newTab: true }),
  'command-shift-return': call(unburrow).with({ newTab: true }),
  'tab': goDfsForward,
  'shift-tab': goDfsBack,
  'escape': goToRoot,
  'backspace': unburrow,
  't': goToTop,
  'p': goToParentsIc,
  'y': goToParentsParent,
  '\\': goToParentsParent,
  'o': unburrow,
  'u': goToParentsIc,
  'i': unburrow,
  'b': goDfsBack,
  'm': goDfsForward,
  'n': call(goDfsForward).with({skipChildren: true}),
  ',': goDfsBack,
  ';': duplicateTab,
  '.': openTabToRoot,
  '[': lateralBack,
  ']': lateralNext,
  '1': call(goToAnIcLink).with({ level: 3 }),
  '2': call(goToAnIcLink).with({ level: 2 }),
  '3': call(goToAnIcLink).with({ level: 1 }),
  '4': call(goToAnIcLink).with({ level: 0 }),
  'q': call(goToAPreviousLink).with({ level: 3 }),
  'w': call(goToAPreviousLink).with({ level: 2 }),
  'e': call(goToAPreviousLink).with({ level: 1 }),
  'r': call(goToAPreviousLink).with({ level: 0 }),
  'a': call(goToASelectedLink).with({ level: 3 }),
  's': call(goToASelectedLink).with({ level: 2 }),
  'd': call(goToASelectedLink).with({ level: 1 }),
  'f': call(goToASelectedLink).with({ level: 0 }),
  'z': call(goToANextLink).with({ level: 3 }),
  'x': call(goToANextLink).with({ level: 2 }),
  'c': call(goToANextLink).with({ level: 1 }),
  'v': call(goToANextLink).with({ level: 0 })
}

document.onkeydown = function(e) {
  var modifiers =
    (e.metaKey ? 'command-' : '') +
    (e.altKey ? 'alt-' : '') +
    (e.ctrlKey ? 'ctrl-' : '') +
    (e.shiftKey ? 'shift-' : '');

  var keyName = keyNames[e.keyCode];
  var shortcutName = modifiers + keyName;

  var preventDefaultList = ['space', 'tab'];
  if (preventDefaultList.indexOf(keyName) !== -1) {
    e.preventDefault();
  }

  (shortcutMovements[shortcutName]||function(){})();
}

function call(fcn) {
  return {
    with: function (){
      var originalArguments = Array.prototype.slice.call(arguments);
      return function () {
        fcn.apply(this, originalArguments);
      }
    }
  }
}
