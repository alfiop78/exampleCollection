(() => {
  var app = {
    Step : new Steps('stepTranslate'),
    prev : document.getElementById('prev'),
    next : document.getElementById('next')
  };

  prev.onclick = function(e) {app.Step.previous();};

  next.onclick = function(e) {app.Step.next();};

})();
