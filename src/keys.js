var keyNames = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',

  71: 'g',
  72: 'h',
  75: 'k',
  74: 'j',
  76: 'l',
  186: ';',
  222: '\'',

  220: '\\',

  89: 'y',
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

  78: 'n',
  77: 'm',
  188: ',',
  190: '.',
  191: '/',

  192: '`',

  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',

  81: 'q',
  87: 'w',
  69: 'e',
  82: 'r',
  84: 't',

  65: 'a',
  83: 's',
  68: 'd',
  70: 'f',
  71: 'g',

  90: 'z',
  88: 'x',
  67: 'c',
  86: 'v',
  66: 'b',

  55: '7',
  56: '8',
  57: '9',
  48: '0',

  189: '-',
  187: '='
}

var shortcutMovements = {
  'left': call(goLeft).with({ cycle: true, collapse: false }),
  'right': call(goRight).with({ cycle: true, collapse: false }),
  'up': closeParagraph,
  'down': call(openParagraph).with({ skipIc: false }),

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

  'alt-[': goBfsBack,
  'alt-]': goBfsForward,

  '\\': duplicateTab,

  'y': call(goToLinkInParent).with({ number: 0 }),
  'u': call(goToLinkInParent).with({ number: 1 }),
  'i': call(goToLinkInParent).with({ number: 2 }),
  'o': call(goToLinkInParent).with({ number: 3 }),
  'p': call(goToLinkInParent).with({ number: 4 }),
  '[': call(goToLinkInParent).with({ number: 5 }),
  ']': call(goToLinkInParent).with({ number: 6 }),

  'h': call(goToSibling).with({ number: 0 }),
  'j': call(goToSibling).with({ number: 1 }),
  'k': call(goToSibling).with({ number: 2 }),
  'l': call(goToSibling).with({ number: 3 }),
  ';': call(goToSibling).with({ number: 4 }),
  '\'': call(goToSibling).with({ number: 5 }),

  'n': call(goToChild).with({ number: 0 }),
  'm': call(goToChild).with({ number: 1 }),
  ',': call(goToChild).with({ number: 2 }),
  '.': call(goToChild).with({ number: 3 }),
  '/': call(goToChild).with({ number: 4 }),

  'shift-y': call(goToLinkInParent).with({ number: 0, firstChild: true }),
  'shift-u': call(goToLinkInParent).with({ number: 1, firstChild: true }),
  'shift-i': call(goToLinkInParent).with({ number: 2, firstChild: true }),
  'shift-o': call(goToLinkInParent).with({ number: 3, firstChild: true }),
  'shift-p': call(goToLinkInParent).with({ number: 4, firstChild: true }),
  'shift-[': call(goToLinkInParent).with({ number: 5, firstChild: true }),
  'shift-]': call(goToLinkInParent).with({ number: 6, firstChild: true }),

  'shift-h': call(goToSibling).with({ number: 0, firstChild: true }),
  'shift-j': call(goToSibling).with({ number: 1, firstChild: true }),
  'shift-k': call(goToSibling).with({ number: 2, firstChild: true }),
  'shift-l': call(goToSibling).with({ number: 3, firstChild: true }),
  'shift-;': call(goToSibling).with({ number: 4, firstChild: true }),
  'shift-\'': call(goToSibling).with({ number: 5, firstChild: true }),

  'shift-n': call(goToChild).with({ number: 0, firstChild: true }),
  'shift-m': call(goToChild).with({ number: 1, firstChild: true }),
  'shift-,': call(goToChild).with({ number: 2, firstChild: true }),
  'shift-.': call(goToChild).with({ number: 3, firstChild: true }),
  'shift-/': call(goToChild).with({ number: 4, firstChild: true }),


  '1': call(goToAnIcLink).with({ level: 4 }),
  '2': call(goToAnIcLink).with({ level: 3 }),
  '3': call(goToAnIcLink).with({ level: 2 }),
  '4': call(goToAnIcLink).with({ level: 1 }),
  '5': call(goToAnIcLink).with({ level: 0 }),

  'q': call(goToAPreviousLink).with({ level: 4 }),
  'w': call(goToAPreviousLink).with({ level: 3 }),
  'e': call(goToAPreviousLink).with({ level: 2 }),
  'r': call(goToAPreviousLink).with({ level: 1 }),
  't': call(goToAPreviousLink).with({ level: 0 }),

  'a': call(goToASelectedLink).with({ level: 4 }),
  's': call(goToASelectedLink).with({ level: 3 }),
  'd': call(goToASelectedLink).with({ level: 2 }),
  'f': call(goToASelectedLink).with({ level: 1 }),
  'g': call(goToASelectedLink).with({ level: 0 }),

  'z': call(goToANextLink).with({ level: 4 }),
  'x': call(goToANextLink).with({ level: 3 }),
  'c': call(goToANextLink).with({ level: 2 }),
  'v': call(goToANextLink).with({ level: 1 }),
  'b': call(goToANextLink).with({ level: 0 }),

  'shift-q': call(goToAPreviousLink).with({ level: 3, firstChild: true }),
  'shift-w': call(goToAPreviousLink).with({ level: 2, firstChild: true }),
  'shift-e': call(goToAPreviousLink).with({ level: 1, firstChild: true }),
  'shift-r': call(goToAPreviousLink).with({ level: 0, firstChild: true }),

  'shift-a': call(goToASelectedLink).with({ level: 3, firstChild: true }),
  'shift-s': call(goToASelectedLink).with({ level: 2, firstChild: true }),
  'shift-d': call(goToASelectedLink).with({ level: 1, firstChild: true }),
  'shift-f': call(goToASelectedLink).with({ level: 0, firstChild: true }),

  'shift-z': call(goToANextLink).with({ level: 3, firstChild: true }),
  'shift-x': call(goToANextLink).with({ level: 2, firstChild: true }),
  'shift-c': call(goToANextLink).with({ level: 1, firstChild: true }),
  'shift-v': call(goToANextLink).with({ level: 0, firstChild: true }),

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
