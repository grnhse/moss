window.addEventListener('keydown', function(e) {
  if (e.altKey && document.getElementsByClassName('keys-helper').length === 0){
    addShortcutOverlay();
  }
});

window.addEventListener('keyup', function(e) {
  var ALT_KEY_CODE = 18;
  if (e.keyCode === ALT_KEY_CODE){
    show(currentLink(), { scroll: false });
  }
});

function addShortcutOverlay() {
  var lettersById = {};

  for (var key in shortcutRelationships) {
    var relationship = shortcutRelationships[key];
    var result = shortcutRelationships[key]();
    var resultId = (shortcutRelationships[key]()||{}).id;

    if (resultId) {
      addToObject(lettersById, resultId, key);
    }
  }

  paintOverlay(lettersById);
}

function paintOverlay(lettersById) {
  for (var id in lettersById) {
    var letters = lettersById[id].sort(function(a, b){
      if (a.length !== b.length) {
        return a.length - b.length;
      } else {
        return a > b ? 1 : -1;
      }
    });

    var link = document.getElementById(id);

    var prettyKeysList = ' (' + letters.join(', ') + ')';
    var keysElement = document.createElement('span');
    var innerSpan = document.createElement('span');
    keysElement.classList.add('keys-helper');
    innerSpan.appendChild(document.createTextNode(prettyKeysList));
    keysElement.appendChild(innerSpan);

    link.parentNode.insertBefore(keysElement, link.nextSibling);
  }
}

function removeShortcutOverlay() {
  var elements = Array.prototype.slice.call(document.getElementsByClassName("keys-helper"));
  for (var i = 0; i < elements.length; i++) {
    elements[i].parentNode.removeChild(elements[i]);
  }
}

function addToObject(lettersById, id, key) {
  pushOrCreate(lettersById, id, key);
}

function pushOrCreate(object, key, item) {
  if (Array.isArray(object[key])) {
    object[key].push(item);
  } else {
    object[key] = [item];
  }
}
