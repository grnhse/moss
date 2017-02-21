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

var shortcutRelationships = {
  'left': leftwardLink,
  'right': rightwardLink,
  'up': upwardLink,
  'down': downwardLink,

  'tab': getDfsNext,
  'shift-tab': getDfsPrevious,
  'space': getDfsNextSkipChildren,
  'shift-space': getDfsPreviousSkipChildren,
  'ctrl-tab': getBfsPrevious,
  'ctrl-shift-tab': getBfsNext,
  'return': downwardOrOpenLink,
  'shift-return': upwardLink,
  'backspace': upwardLink,
  'escape': rootLink,

  'shift-left': getBfsPrevious,
  'shift-right': getBfsNext,

  'y': call(getALinkInParent).with({ number: 0 }),
  'u': call(getALinkInParent).with({ number: 1 }),
  'i': call(getALinkInParent).with({ number: 2 }),
  'o': call(getALinkInParent).with({ number: 3 }),
  'p': call(getALinkInParent).with({ number: 4 }),
  '[': call(getALinkInParent).with({ number: 5 }),
  ']': call(getALinkInParent).with({ number: 6 }),

  'h': call(getASiblingLink).with({ number: 0 }),
  'j': call(getASiblingLink).with({ number: 1 }),
  'k': call(getASiblingLink).with({ number: 2 }),
  'l': call(getASiblingLink).with({ number: 3 }),
  ';': call(getASiblingLink).with({ number: 4 }),
  '\'': call(getASiblingLink).with({ number: 5 }),

  'n': call(getALinkInChild).with({ number: 0 }),
  'm': call(getALinkInChild).with({ number: 1 }),
  ',': call(getALinkInChild).with({ number: 2 }),
  '.': call(getALinkInChild).with({ number: 3 }),
  '/': call(getALinkInChild).with({ number: 4 }),

  'shift-y': call(getALinkInParent).with({ number: 0, firstChild: true }),
  'shift-u': call(getALinkInParent).with({ number: 1, firstChild: true }),
  'shift-i': call(getALinkInParent).with({ number: 2, firstChild: true }),
  'shift-o': call(getALinkInParent).with({ number: 3, firstChild: true }),
  'shift-p': call(getALinkInParent).with({ number: 4, firstChild: true }),
  'shift-[': call(getALinkInParent).with({ number: 5, firstChild: true }),
  'shift-]': call(getALinkInParent).with({ number: 6, firstChild: true }),

  'shift-h': call(getASiblingLink).with({ number: 0, firstChild: true }),
  'shift-j': call(getASiblingLink).with({ number: 1, firstChild: true }),
  'shift-k': call(getASiblingLink).with({ number: 2, firstChild: true }),
  'shift-l': call(getASiblingLink).with({ number: 3, firstChild: true }),
  'shift-;': call(getASiblingLink).with({ number: 4, firstChild: true }),
  'shift-\'': call(getASiblingLink).with({ number: 5, firstChild: true }),

  'shift-n': call(getALinkInChild).with({ number: 0, firstChild: true }),
  'shift-m': call(getALinkInChild).with({ number: 1, firstChild: true }),
  'shift-,': call(getALinkInChild).with({ number: 2, firstChild: true }),
  'shift-.': call(getALinkInChild).with({ number: 3, firstChild: true }),
  'shift-/': call(getALinkInChild).with({ number: 4, firstChild: true }),

  '1': call(getAnIcLink).with({ level: 4 }),
  '2': call(getAnIcLink).with({ level: 3 }),
  '3': call(getAnIcLink).with({ level: 2 }),
  '4': call(getAnIcLink).with({ level: 1 }),
  '5': call(getAnIcLink).with({ level: 0 }),

  'q': call(getAPreviousLink).with({ level: 4 }),
  'w': call(getAPreviousLink).with({ level: 3 }),
  'e': call(getAPreviousLink).with({ level: 2 }),
  'r': call(getAPreviousLink).with({ level: 1 }),
  't': call(getAPreviousLink).with({ level: 0 }),

  'a': call(getASelectedLink).with({ level: 4 }),
  's': call(getASelectedLink).with({ level: 3 }),
  'd': call(getASelectedLink).with({ level: 2 }),
  'f': call(getASelectedLink).with({ level: 1 }),
  'g': call(getASelectedLink).with({ level: 0 }),

  'z': call(getANextLink).with({ level: 4 }),
  'x': call(getANextLink).with({ level: 3 }),
  'c': call(getANextLink).with({ level: 2 }),
  'v': call(getANextLink).with({ level: 1 }),
  'b': call(getANextLink).with({ level: 0 }),

  'shift-q': call(getAPreviousLink).with({ level: 4, firstChild: true }),
  'shift-w': call(getAPreviousLink).with({ level: 3, firstChild: true }),
  'shift-e': call(getAPreviousLink).with({ level: 2, firstChild: true }),
  'shift-r': call(getAPreviousLink).with({ level: 1, firstChild: true }),
  'shift-t': call(getAPreviousLink).with({ level: 0, firstChild: true }),

  'shift-a': call(getASelectedLink).with({ level: 4, firstChild: true }),
  'shift-s': call(getASelectedLink).with({ level: 3, firstChild: true }),
  'shift-d': call(getASelectedLink).with({ level: 2, firstChild: true }),
  'shift-f': call(getASelectedLink).with({ level: 1, firstChild: true }),
  'shift-g': call(getASelectedLink).with({ level: 0, firstChild: true }),

  'shift-z': call(getANextLink).with({ level: 4, firstChild: true }),
  'shift-x': call(getANextLink).with({ level: 3, firstChild: true }),
  'shift-c': call(getANextLink).with({ level: 2, firstChild: true }),
  'shift-v': call(getANextLink).with({ level: 1, firstChild: true }),
  'shift-b': call(getANextLink).with({ level: 0, firstChild: true }),

  '7': call(scrollTo).with({ location: 0 }),
  '8': call(scrollTo).with({ location: 1 }),
  '9': call(scrollTo).with({ location: 2 }),
  '0': call(scrollTo).with({ location: 3 }),

  '-': scrollUp,
  '=': scrollDown,
}

window.addEventListener('keydown', function(e) {
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

  // var newTab = e.metaKey || e.ctrlKey;
  var newTab = false;

  var link = (shortcutRelationships[shortcutName]||function(){})() ||
    currentLink();

  openLink(link, newTab);
});

function call(fcn) {
  return {
    with: function (){
      var originalArguments = Array.prototype.slice.call(arguments);
      return function () {
        return fcn.apply(this, originalArguments);
      }
    }
  }
}
