(() => {
  var app = {
    card : document.querySelector('.card'),
    cardTitle : document.querySelector('.cardTable > .title > h6'),
    content : document.getElementById('content'),
    body : document.getElementById('body'),
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

  app.body.onmousedown = app.dragStart;
  app.body.onmouseup = app.dragEnd;
  app.body.onmousemove = app.drag;
  // TODO: aggiungere anhce eventi touch...

  app.handlerDragStart = function(e) {
    console.log('start');
    // Set the drag's format and data. Use the event target's id for the data
    // -- test 1 OK ---
    console.log(e.target.id);
    e.dataTransfer.setData('text/plain', e.target.id);
    console.log(e.dataTransfer);
  };

  app.handlerDragOver = function(e) {
    console.log('dragOver');
    e.preventDefault();
  };

  app.handlerDragEnter = function(e) {
    e.preventDefault();
    console.log('dragEnter');
    console.log(e.target);
    if (e.target.className === 'dropzone') {
      console.log('dropzone');
    }
  };

  app.handlerDragLeave = function(e) {
    e.preventDefault();
  };

  app.handlerDragEnd = function(e) {
    e.preventDefault();
  };

  app.handlerDrop = function(e) {
    e.preventDefault();
    console.log('drop');
    let data = e.dataTransfer.getData('text/plain');
    console.log(e.dataTransfer);
    app.content.appendChild(document.getElementById(data));
  };

  Array.from(document.querySelectorAll('a[draggable]')).forEach((item, i) => {
    console.log(item);
    item.ondragstart = app.handlerDragStart;
    app.content.ondragover = app.handlerDragOver;
    app.content.ondragenter = app.handlerDragEnter;
    app.content.ondragleave = app.handlerDragLeave;
    app.content.ondrop = app.handlerDrop;
    app.content.ondragend = app.handlerDragEnd;
  });


})();
