(() => {
  var app = {
    // templates
    tmplList: document.getElementById('tmpl-li'),
    tmplCard: document.getElementById('tmpl-card'),
    // dialogs
    dialogTables: document.getElementById('dlg-tables'),
    // buttons
    btnCreateDimension: document.getElementById('btn-create-dimension'),
    btnSelectSchema: document.getElementById('btn-select-schema'),
    // body
    body: document.getElementById('body'),
    canvasArea: document.getElementById('canvas-area'),
    translate: document.getElementById('translate'),
    svg: document.getElementById('svg'),
    hierarchy: document.getElementById('h')

  }

  /* const canvas1 = document.getElementById('canvas-1');
  canvas1.width = app.translate.offsetWidth;
  canvas1.height = app.translate.offsetHeight;
  var canvasOffsetTop = canvas1.offsetTop;
  var canvasOffsetLeft = canvas1.offsetLeft;
  // const canvas2 = document.getElementById('canvas-2');
  const ctx1 = canvas1.getContext('2d'); */
  // const ctx2 = canvas2.getContext('2d');
  /* ctx1.lineWidth = 2.5;
  ctx1.strokeStyle = "orangered";
  ctx1.beginPath(); // Start a new path
  ctx1.moveTo(0, 54); // Move the pen to (0, 50)
  ctx1.lineTo(200, 54); // Draw a line to (200, 50)
  ctx1.stroke(); // Render the path

  ctx1.beginPath(); // Start a new path
  ctx1.moveTo(100, 54); // Move the pen to (30, 50)
  ctx1.lineTo(100, 200); // Draw a line to (150, 100)
  ctx1.stroke(); // Render the path */

  /* ctx2.lineWidth = 2.5;
  ctx2.strokeStyle = "orangered";
  ctx2.beginPath(); // Start a new path
  ctx2.moveTo(100, 54); // Move the pen to (30, 50)
  ctx2.lineTo(200, 54); // Draw a line to (150, 100)
  ctx2.stroke(); // Render the path

  ctx2.beginPath(); // Start a new path
  ctx2.moveTo(100, 54); // Move the pen to (30, 50)
  ctx2.lineTo(100, 0); // Draw a line to (150, 100)
  ctx2.stroke(); // Render the path */

  // Callback function to execute when mutations are observed
  // const targetNode = document.querySelectorAll('ul');
  // console.log(targetNode);
  const config = { attributes: true, childList: true, subtree: true };

  const callback = (mutationList, observer) => {
    // console.log(mutationList, observer);
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        // console.info('A child node has been added or removed.');
        Array.from(mutation.addedNodes).forEach(node => {
          // console.log(node.nodeName);
          if (node.nodeName !== '#text') {
            if (node.hasAttribute('data-fn')) node.addEventListener('click', app[node.dataset.fn]);
            if (node.hasChildNodes()) {
              node.querySelectorAll('*[data-fn]').forEach(element => element.addEventListener('click', app[element.dataset.fn]));
            }
          }
        });
      } else if (mutation.type === 'attributes') {
        // console.log(`The ${mutation.attributeName} attribute was modified.`);
        if (mutation.target.hasChildNodes()) mutation.target.querySelectorAll('*[data-fn]').forEach(element => element.addEventListener('click', app[element.dataset.fn]));
      }
    }
  };
  // Create an observer instance linked to the callback function
  const observerList = new MutationObserver(callback);
  // Start observing the target node for configured mutations
  // observerList.observe(targetNode, config);
  // observerList.observe(document.getElementById('body'), config);
  document.querySelectorAll('dialog').forEach(dialog => observerList.observe(dialog, config));
  observerList.observe(app.body, config);

  /* drag events */

  app.handlerDragStart = (e) => {
    console.log('e.target : ', e.target.id);
    e.target.classList.add('dragging');
    app.dragElementPosition = { x: e.offsetX, y: e.offsetY };
    // console.log(app.dragElementPosition);
    e.dataTransfer.setData('text/plain', e.target.id);
    // creo la linea
    if (app.hierarchy.childElementCount > 0) {
      app.l = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      app.l.dataset.id = app.svg.childElementCount;
      // app.l.setAttribute('fill', 'transparent');
      // app.l.setAttribute('stroke', 'red');
      // app.l.setAttribute('stroke-linecap', 'round');
      // app.l.setAttribute('stroke-width', 3);
      app.svg.appendChild(app.l);
      app.letsdraw = {
        x: 0,
        y: 0
      }
    }
    // e.dataTransfer.setData('application/x-moz-node', e.target.innerHTML);
    /* const span = document.createElement('span');
    span.innerText = e.target.dataset.label;
    span.style.backgroundColor = '#494949';
    span.style.color = 'white';
    e.target.appendChild(span);
    e.dataTransfer.setDragImage(span, 10, 10); */
    console.log(e.dataTransfer);
    e.dataTransfer.effectAllowed = "copy";
  }

  app.handlerDragOverH = (e) => {
    e.preventDefault();
    // console.log('dragOver:', e.target);
    if (e.target.classList.contains('dropzone')) {
      e.dataTransfer.dropEffect = "copy";
      // console.log(e.currentTarget, e.target);
      // recupero l'offsetLeft della card a sinistra del mouse
      let lastCard = h.querySelector('div[data-id]:last-child');
      // console.log(lastCard);
      // console.log(e.target);
      if (app.l) app.l.setAttribute('d', 'M ' + app.letsdraw.x + ' ' + app.letsdraw.y + ' L ' + (e.offsetX + e.target.offsetLeft - app.dragElementPosition.x - 10) + ' ' + (e.offsetY - app.dragElementPosition.y + 13.5));
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }

  app.handlerDragEnterCard = (e) => {
    // console.log('dragEnter Card');
    // console.log(e.target, e.currentTarget);
    /* if (app.l.dataset.id !== app.svg.childElementCount) {
      app.l = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      app.l.dataset.id = app.svg.childElementCount;
      app.l.setAttribute('fill', 'transparent');
      app.l.setAttribute('stroke', 'blue');
      app.l.setAttribute('stroke-linecap', 'round');
      app.l.setAttribute('stroke-width', 4);
      app.svg.appendChild(app.l);
      app.letsdraw = {
        x: e.target.offsetLeft + e.target.offsetWidth,
        y: e.target.offsetTop + (e.target.offsetHeight / 2)
      }
    } */
  }

  app.handlerDragEnterH = (e) => {
    console.log('handlerDragEnter :', e.target);
    e.preventDefault();
    if (e.target.classList.contains('dropzone')) {
      console.info('DROPZONE');
      // e.dataTransfer.dropEffect = "copy";
      // coloro il border differente per la dropzone
      e.target.classList.add('dropping');
      if (app.hierarchy.childElementCount > 0) {
        let table, card, pathFrom;
        if (e.target.classList.contains('card')) {
          // sono entrato nel div .card.dropzone
          card = e.target.parentElement;
          pathFrom = card.querySelector('small[data-path-from]');
          table = card.querySelector('.table');
          if (card.previousElementSibling) {
            table = card.previousElementSibling.querySelector('.table');
            card.previousElementSibling.querySelector('.card-area').dataset.joinCount++;
            pathFrom = card.previousElementSibling.querySelector('small[data-path-from]');
          }
        } else {
          // sono entrato nel div .hierarchy.dropzone
          card = h.querySelector('.card.dropzone:last-child');
          card.dataset.joinCount++;
          pathFrom = card.querySelector('small[data-path-from]');
          table = h.querySelector('.card.dropzone:last-child .table');
          if (card.previousElementSibling) {
            table = card.previousElementSibling.querySelector('.table');
            pathFrom = card.previousElementSibling.querySelector('small[data-path-from]');
          }
        }
        app.letsdraw = {
          x: table.offsetLeft + table.offsetWidth,
          y: table.offsetTop + (table.offsetHeight / 2)
        }
        /* app.letsdraw = {
          x: pathFrom.offsetLeft,
          y: pathFrom.offsetTop
        } */
        console.log(app.letsdraw);
        // app.line.setAttribute('d', 'M ' + app.letsdraw.x + ' ' + app.letsdraw.y + ' L ' + e.offsetX + ' ' + e.offsetY);
      }
    } else {
      console.warn('non in dropzone');
      // TODO: se non sono in una dropzone modifico l'icona del drag&drop (icona "non consentito")
      // e.dataTransfer.dropEffect = "none";
    }
  }

  app.handlerDragLeaveH = (e) => {
    console.log('dragLeave : ', e.target);
    e.preventDefault();
    e.target.classList.remove('dropping');
  }

  app.handlerDragLeaveCard = (e) => {
    e.preventDefault();
  }

  app.handlerDragEndH = async (e) => {
    e.preventDefault();
    // faccio il DESCRIBE della tabella
    // controllo lo stato di dropEffect per verificare se il drop è stato completato correttamente, come descritto qui:https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#drag_end
    // in app.getTable() vengono utilizzate le property della classe Cube (cube.card.schema, cube.card.tableName);
    if (e.dataTransfer.dropEffect === 'copy') {
      // imposto prima la <ul> altrimenti si verifica il bug riportato nella issue#50
      const ul = Hier.activeCard.querySelector("ul[data-id='columns']");
      const data = await app.getTable();
      // app.addFields(ul, data);
    }
  }

  app.handlerDropH = (e) => {
    e.preventDefault();
    e.target.classList.replace('dropping', 'dropped');
    if (!e.target.classList.contains('dropzone')) return;
    // const elementId = e.dataTransfer.getData('text/plain');
    // console.log(elementId);
    const liElement = document.getElementById(e.dataTransfer.getData('text/plain'));
    console.log(liElement);
    liElement.classList.remove('dragging');
    const content = app.tmplCard.content.cloneNode(true);
    let span;
    let card;
    if (e.target.classList.contains('card')) {
      // sto aggiungendo la tabella alla card (non alla hierarchy)
      card = content.querySelector('.card-area');
      card.id = liElement.id;
      span = card.querySelector('span');
      span.innerHTML = liElement.dataset.label;
      card.dataset.label = liElement.dataset.label;
      card.dataset.schema = liElement.dataset.schema;
      card.dataset.level = app.hierarchy.childElementCount;
      e.target.appendChild(card);
    } else {
      card = content.querySelector('.card.dropzone');
      card.querySelector('.card-area').id = liElement.id;
      // imposto il nome della tabella draggata
      span = card.querySelector('span');
      span.innerHTML = liElement.dataset.label;
      card.querySelector('.card-area').dataset.label = liElement.dataset.label;
      card.querySelector('.card-area').dataset.schema = liElement.dataset.schema;
      card.querySelector('.card-area').dataset.level = app.hierarchy.childElementCount;
      app.hierarchy.querySelector('.flow').appendChild(card);
      card.addEventListener('dragenter', app.handlerDragEnterCard, true);
      card.addEventListener('dragover', app.handlerDragOverCard, true);
      card.addEventListener('dragleave', app.handlerDragLeaveCard, true);
      card.addEventListener('drop', app.handlerDropCard, true);
      card.addEventListener('dragend', app.handlerDragEndCard, true);
    }
    if (app.l) {
      span.dataset.lineId = app.l.dataset.id;
      app.l.dataset.level = app.hierarchy.childElementCount;
      // let span = card.querySelector('span');
      app.hierarchy.querySelectorAll(".card-area[data-level='" + app.hierarchy.childElementCount + "']").forEach(card => {
        const line = app.svg.querySelector("path[data-level='" + app.hierarchy.childElementCount + "'][data-id='" + span.dataset.lineId + "']");
        line.setAttribute('stroke', 'orange');
        line.setAttribute('d', 'M ' + app.letsdraw.x + ' ' + app.letsdraw.y + ' L ' + card.querySelector('.table').offsetParent.offsetLeft + ' ' + (card.querySelector('.table').offsetParent.offsetTop + (span.offsetParent.offsetHeight / 2)));
      });
    }
  }

  /* drag events */


  document.querySelectorAll('li').forEach(el => {
    el.ondragstart = app.handlerDragStart;
  });

  /* end drag events */
  app.hierarchy.addEventListener('dragover', app.handlerDragOverH, true);
  app.hierarchy.addEventListener('dragenter', app.handlerDragEnterH, true);
  app.hierarchy.addEventListener('dragleave', app.handlerDragLeaveH, true);
  app.hierarchy.addEventListener('drop', app.handlerDropH, true);
  app.hierarchy.addEventListener('dragend', app.handlerDragEndH, true);
  /* end drag events */

  /* page init  (impostazioni inziali per la pagina, alcune sono necessarie per essere catturate dal mutationObserve)*/
  // TODO: da implementare
  // app.dialogConnection.showModal();
  /* end page init */

  /*onclick events*/

  app.handlerTest = () => {
    const c = document.querySelector('div[data-id="card-struct"]');
    let copy = c.cloneNode(true);
    const hier = document.getElementById('h');
    h.appendChild(copy);
  }
  /* end onclick events*/

  /* mouse events */
  document.querySelectorAll('.translate').forEach(el => {
    el.onmousedown = (e) => {
      console.log(app.coords);
      app.coords = { x: +e.currentTarget.dataset.translateX, y: +e.currentTarget.dataset.translateY };
      app.el = e.currentTarget;
    }

    el.onmousemove = (e) => {
      if (app.el) {
        app.coords.x += e.movementX;
        app.coords.y += e.movementY;
        // if (app.x > 30) return;
        e.currentTarget.style.transform = "translate(" + app.coords.x + "px, " + app.coords.y + "px)";
        e.currentTarget.dataset.translateX = app.coords.x;
        e.currentTarget.dataset.translateY = app.coords.y;
      }
    }

    el.onmouseup = (e) => {
      // console.log(e);
      // e.target.dataset.translateX = app.x;
      delete app.el;
    }
  });

  /* end mouse events */

})();
