function sendRequestTo(url, success){
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      success(request.responseText);
    } else {
      throw new Error(request.status + ': Server reached but responded with error.');
    }
  };

  request.onerror = function() {
    throw new Error(request.status + ': Connection error: Server could not be reached');
  };

  request.send();
}
