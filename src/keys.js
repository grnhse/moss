var keyNames = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  72: 'h',
  75: 'k',
  74: 'j',
  76: 'l',

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
  53: '5',
  84: 't',
  71: 'g',
  66: 'b',
  54: '6',
  89: 'y',
  72: 'h',
  78: 'n',

  55: '7',
  56: '8',
  57: '9',
  48: '0',

  189: '-',
  187: '='
}

var shortcutMovements = {
  'down': call(goDown).with({ cycle: true, collapse: false }),
  'up': call(goUp).with({ cycle: false, collapse: true }),
  'right': openParagraph,
  'left': closeParagraph,

  'h': closeParagraph,
  'j': call(goDown).with({ cycle: true, collapse: false }),
  'k': call(goUp).with({ cycle: false, collapse: true }),
  'l': openParagraph,

  'shift-space': call(goDfsBack).with({ skipChildren: true }),
  'return': burrow,
  'shift-return': unburrow,
  'command-return': call(burrow).with({ newTab: true }),
  'ctrl-return': call(burrow).with({ newTab: true }),
  'command-shift-return': call(unburrow).with({ newTab: true }),
  'tab': goDfsForward,
  'shift-tab': goDfsBack,
  'escape': goToRoot,
  'backspace': unburrow,

  '\'': openTabToRoot,
  ';': duplicateTab,

  'u': goToParentsParent,
  'i': unburrow,
  'o': goToTop,
  'p': goToBottom,

  '[': lateralBack,
  ']': lateralNext,

  'space': call(goDfsForward).with({ skipChildren: true }),
  'm': goDfsForward,
  ',': goDfsBack,
  '.': call(goDfsBack).with({ skipChildren: true }),

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

  '6': call(goToChild).with({ number: 0 }),
  'y': call(goToChild).with({ number: 1 }),
  'h': call(goToChild).with({ number: 2 }),
  'n': call(goToChild).with({ number: 3 }),

  '5': call(goToSibling).with({ number: 0 }),
  't': call(goToSibling).with({ number: 1 }),
  'g': call(goToSibling).with({ number: 2 }),
  'b': call(goToSibling).with({ number: 3 }),

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
