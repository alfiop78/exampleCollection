(() => {
  var app = {
    card : document.querySelector('.card'),
    cardTitle : document.querySelector('.card .cardTable > h5'),
    page : document.getElementById('page'),
    currentX : 0,
    currentY : 0,
    initialX : 0,
    initialY : 0,
    active : false,
    xOffset : 0,
    yOffset : 0
  };

  app.dragStart = function(e) {
    if (e.type === 'touchstart') {
        app.initialX = e.touches[0].clientX - app.xOffset;
        app.initialY = e.touches[0].clientY - app.yOffset;
      } else {
        app.initialX = e.clientX - app.xOffset;
        app.initialY = e.clientY - app.yOffset;
      }

      // console.log(e.target);
      // console.log(app.cardTitle);
      if (e.target === app.cardTitle) {
        app.active = true;
      }
  };

  app.dragEnd = function(e) {
    console.log(e.target);
    app.initialX = app.currentX;
    app.initialY = app.currentY;
    app.active = false;
  };

  app.drag = function(e) {
    // console.log(e.target);
    if (app.active) {
      e.preventDefault();

      if (e.type === 'touchmove') {
          app.currentX = e.touches[0].clientX - app.initialX;
          app.currentY = e.touches[0].clientY - app.initialY;
        } else {
          app.currentX = e.clientX - app.initialX;
          app.currentY = e.clientY - app.initialY;
        }

        app.xOffset = app.currentX;
        app.yOffset = app.currentY;

        app.card.style.transform = 'translate3d(' + app.currentX + 'px, ' + app.currentY + 'px, 0)';
      }
  };


  app.page.onmousedown = app.dragStart;
  app.page.onmouseup = app.dragEnd;
  app.page.onmousemove = app.drag;
  // TODO: aggiungere anhce eventi touch...


})();
