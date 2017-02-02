window.addEventListener('wheel', function(e) {
  if (e.metaKey || e.altKey || e.ctrlKey) {
    e.preventDefault();
    if (e.deltaY > 10) {
      goDfsBackward();
    } else if (e.deltaY < -10) {
      goDfsForward();
    }
  }
});
