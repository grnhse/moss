var keyNames = {
  87: 'w',
  65: 'a',
  83: 's',
  68: 'd',
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
  221: ']'
}

var shortcutMovements = {
  'j': goDown,
  's': goDown,
  'down': call(goDown).with({ cycle: false }),
  'k': goUp,
  'up': call(goDown).with({ cycle: false }),
  'w': goUp,
  'h': closeParagraph,
  'a': closeParagraph,
  'left': closeParagraph,
  'l': openParagraph,
  'd': openParagraph,
  'right': openParagraph,
  'space': goToNextSubject,
  'shift-space': goToPreviousSubject,
  'return': burrow,
  'shift-return': unburrow,
  'command-return': call(burrow).with({ newTab: true }),
  'ctrl-return': call(burrow).with({ newTab: true }),
  'command-shift-return': call(unburrow).with({ newTab: true }),
  'tab': goDfsForward,
  'shift-tab': goDfsBack,
  'escape': goToRoot,
  'backspace': unburrow,
  'n': rooksNext,
  't': goToTop,
  'y': goToParentsIc,
  'u': unburrow,
  'i': goToTopOrCollapse,
  'b': goToBottom,
  'm': more,
  ',': goToBottom,
  ';': duplicateTab,
  '.': openTabToRoot,
  '[': lateralBack,
  ']': lateralNext
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
