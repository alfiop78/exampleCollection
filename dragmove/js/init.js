(() => {
  var app = {
    card : null,
    cardTitle : null,
    content : document.getElementById('content'),
    body : document.getElementById('body'),
    currentX : 0,
    currentY : 0,
    initialX : 0,
    initialY : 0,
    active : false,
    xOffset : 0,
    yOffset : 0,
    dragElement : null,
    elementMenu : null
  };


  app.dragStart = function(e) {
    if (e.target.localName === 'h6') {
      app.cardTitle = e.target;
      app.card = e.path[4];
      // recupero la posizione attuale della card tramite l'attributo x-y impostato su .cardTable
      app.xOffset = e.path[4].getAttribute('x');
      app.yOffset = e.path[4].getAttribute('y');
    }
    // cardTitle = document.querySelector('.card.table .title > h6');
    if (e.type === 'touchstart') {
        app.initialX = e.touches[0].clientX - app.xOffset;
        app.initialY = e.touches[0].clientY - app.yOffset;
      } else {
        app.initialX = e.clientX - app.xOffset;
        app.initialY = e.clientY - app.yOffset;
      }

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
    // console.log(e);
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
        // imposto sulla .cardTable le posizioni dove è 'stato lasciato'  dopo il drag in modo da "riprendere" lo
        // spostamento da dove era rimasto
        app.card.setAttribute('x', app.xOffset);
        app.card.setAttribute('y', app.yOffset);

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
    app.dragElement = document.getElementById(e.target.id);
    console.log(e.path);
    app.elementMenu = e.path[1]; // elemento da eliminare al termine drl drag&drop
    // console.log(e.dataTransfer);
  };

  app.handlerDragOver = function(e) {
    console.log('dragOver');
    e.preventDefault();
    // console.log(e.clientX);
    // console.log(e.clientY);

    // console.log(e.target);
  };

  app.handlerDragEnter = function(e) {
    console.log('dragEnter');
    e.preventDefault();
    // elimino .menu per trasformarla in .card.table
    // app.dragElement.classList.remove('menu');
    // app.dragElement.classList.add('table');

    console.log(e.target);
    if (e.target.className === 'dropzone') {
      console.log('dropzone');
      e.target.classList.add('dragging');
      // app.dragElement.classList.remove('menu');
      // app.dragElement.classList.add('table');
      // TODO: inserire un effetto css sulla dropzone

    }
  };

  app.handlerDragLeave = function(e) {
    e.preventDefault();
    console.log('dragLeave');
    // console.log(e.target);
    app.content.classList.remove('dragging');
  };

  app.handlerDragEnd = function(e) {
    e.preventDefault();
    console.log('dragEnd');
    console.log(e.target);
    app.content.classList.remove('dragging');
  };

  app.handlerDrop = function(e) {
    e.preventDefault();
    console.log('drop');
    console.log(e);
    let data = e.dataTransfer.getData('text/plain');
    console.log(e.dataTransfer);
    app.body.appendChild(document.getElementById(data));
    app.dragElement.classList.remove('menu');
    app.dragElement.classList.add('table');
    app.dragElement.removeAttribute('draggable');
    // recupero l'id dell'elemento che sto spostando, l'id mi ervirà per eliminare .elementMenu dall'elenco di sinista
    // TODO: terminato il drop elimino l'elemento .elementMenu dall'elenco di sinistra
    app.elementMenu.remove();
    // TODO: imposto la card draggata nella posizione dove si trova il mouse
    console.log(app.dragElement);
    app.dragElement.style.transform = 'translate3d(' + e.offsetX + 'px, ' + e.offsetY + 'px, 0)';
    app.dragElement.setAttribute('x', e.offsetX);
    app.dragElement.setAttribute('y', e.offsetY);

  };

  Array.from(document.querySelectorAll('div[draggable]')).forEach((item) => {
    console.log(item);
    item.ondragstart = app.handlerDragStart;
  });

  app.content.ondragover = app.handlerDragOver;
  app.content.ondragenter = app.handlerDragEnter;
  app.content.ondragleave = app.handlerDragLeave;
  app.content.ondrop = app.handlerDrop;
  app.content.ondragend = app.handlerDragEnd;


})();
