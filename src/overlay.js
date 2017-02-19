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

function addLeftHandShortcuts(lettersById) {
  lettersById[currentLink().id] = ['g'];

  // ['1', '2', '3', '4', '5'].forEach(function(key, index){
  //   push(lettersById, getAnIcLink({ level: 4 - index }).id, key);
  // });

  // ['q', 'w', 'e', 'r', 't'].forEach(function(key, index){
  //   push(lettersById, getAPreviousLink({ level: 4 - index }).id, key);
  // });

  // ['a', 's', 'd', 'f', 'g'].forEach(function(key, index){
  //   push(lettersById, getASelectedLink({ level: 4 - index }).id, key);
  // });

  // ['z', 'x', 'c', 'v', 'b'].forEach(function(key, index){
  //   push(lettersById, getANextLink({ level: 4 - index }).id, key);
  // });
}

function paintOverlay(lettersById) {
  for (var id in lettersById) {
    var letters = lettersById[id];
    var link = document.getElementById(id);

    var prettyKeysList = ' (' + letters.join(' ') + ')';
    var keysElement = document.createElement('span');
    keysElement.classList.add('keys-helper');
    keysElement.appendChild(document.createTextNode(prettyKeysList));

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

