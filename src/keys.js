var keyNames = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  72: 'h',
  75: 'k',
  74: 'j',
  76: 'l',

  78: 'n',

  186: ';',
  222: '\'',

  85: 'u',
  73: 'i',
  79: 'o',
  80: 'p',

  219: '[',
  221: ']',

  13: 'return',
  9: 'tab',
  27: 'escape',
  8: 'backspace',
  32: 'space',

  77: 'm',
  188: ',',
  190: '.',
  191: '/',

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
  86: 'v',

  55: '7',
  56: '8',
  57: '9',
  48: '0',

  189: '-',
  187: '='
}

var shortcutMovements = {
  'down': call(goDown).with({ cycle: false, collapse: false }),
  'up': call(goUp).with({ cycle: false, collapse: false }),
  'right': openParagraph,
  'left': closeParagraph,

  'h': closeParagraph,
  'j': call(goDown).with({ cycle: false, collapse: false }),
  'k': call(goUp).with({ cycle: false, collapse: false }),
  'l': openParagraph,

  '[': goBfsBack,
  ']': goBfsForward,

  'space': call(goDfsForward).with({ skipChildren: true }),
  'shift-space': call(goDfsBackward).with({ skipChildren: true }),
  'return': burrow,
  'shift-return': unburrow,
  'command-return': call(burrow).with({ newTab: true }),
  'ctrl-return': call(burrow).with({ newTab: true }),
  'command-shift-return': call(unburrow).with({ newTab: true }),
  'tab': goDfsForward,
  'shift-tab': goDfsBackward,
  'escape': goToRoot,
  'backspace': unburrow,

  '\'': openTabToRoot,
  ';': duplicateTab,

  'y': goToParentsParent,
  'u': goToParentsParent,
  'i': unburrow,
  'o': goToTop,
  'p': goToBottom,

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
  'v': call(goToANextLink).with({ level: 0 }),

  '7': call(scrollTo).with({ location: 0 }),
  '8': call(scrollTo).with({ location: 1 }),
  '9': call(scrollTo).with({ location: 2 }),
  '0': call(scrollTo).with({ location: 3 }),

  '-': scrollUp,
  '=': scrollDown,
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
