var Canvas = new DrawCanvas('canvas');
(() => {
  var app = {
    // templates
    tmplList: document.getElementById('tmpl-li'),
    tmplCard: document.getElementById('tmpl-card'),
    // body
    body: document.getElementById('body'),
    canvasArea: document.getElementById('canvas-area'),
    translate: document.getElementById('translate'),
    coordsRef: document.getElementById('coords'),
  }

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

  /* canvas */
  // const ctx = app.canvas.getContext('2d');

  Canvas.canvas.addEventListener('click', (e) => {
    for (const [tableId, path2d] of Object.entries(Canvas.ctxTablesObject)) {
      const isPointInPath = Canvas.ctx.isPointInPath(path2d, e.offsetX, e.offsetY);
      if (isPointInPath) {
        console.log(isPointInPath);
        console.log(path2d);
        console.log('tabella selezionata : ', path2d.id, path2d.table);
        // recupero dentro il canvas l'elemento creato dinamicamente con id qui selezionato
        console.log(Canvas.canvas.querySelector('#' + path2d.id));
      }
    }
  }, true);

  Canvas.canvas.addEventListener('mousemove', (e) => {
    app.coordsRef.innerHTML = `<small>x ${e.offsetX}</small><br /><small>y ${e.offsetY}</small>`;
    for (const [tableId, path2d] of Object.entries(Canvas.ctxTablesObject)) {
      const isPointInPath = Canvas.ctx.isPointInPath(path2d, e.offsetX, e.offsetY);
      if (isPointInPath) {
        // console.log(isPointInPath);
        // console.log(path2d);
      }
    }
    /* const isPointInPath = ctx.isPointInPath(app.table, e.offsetX, e.offsetY);
    ctx.fillStyle = isPointInPath ? '#3f3f4036' : 'gainsboro'; */
    // Draw table rect
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fill(app.table);
  }, true);

  app.canvasDragEnter = (e) => {
    e.preventDefault();
    // e.target.classList.remove('dropping');
    if (e.target.classList.contains('dropzone')) {
      console.info('DROPZONE');
      // e.dataTransfer.dropEffect = "copy";
      // coloro il border differente per la dropzone
      e.target.classList.add('dropping');
      /* const breakLine = document.getElementById('break-line-1');
      console.log(e.offsetX, breakLine.getAttribute('x1'));
      if (e.offsetX > breakLine.getAttribute('x1')) {
        console.log('level 2');
      } */
    } else {
      console.warn('non in dropzone');
      // TODO: se non sono in una dropzone modifico l'icona del drag&drop (icona "non consentito")
      // e.dataTransfer.dropEffect = "none";
    }
  }

  app.canvasDragLeave = (e) => {
    e.preventDefault();
    // console.log('dragLeave');
    console.log(e.offsetX, e.offsetY);
  }

  app.canvasDragOver = (e) => {
    e.preventDefault();
    if (e.target.classList.contains('dropzone')) {
      e.dataTransfer.dropEffect = "copy";
      app.coordsRef.innerHTML = `<small>x ${e.offsetX}</small><br /><small>y ${e.offsetY}</small>`;
      Canvas.ctx.save();
      Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
      // ridisegno i buttons e le linee dopo aver pulito il canvas
      Canvas.drawTables();
      // app.createButtons();
      // console.log(app.tables);
      // disegno la linea solo se, nel canvas, è già presente una tabella
      if (Canvas.canvas.childElementCount >= 1) {
        let fromPointX, fromPointY;
        // recupero i fromPoint della precedente tabella. Da qui partirà la linea che si collega alla tabella che sto draggando
        for (const [tableId, props] of Canvas.tables) {
          if ((props.x + 40) < e.offsetX && (props.y - 40) < e.offsetY) {
            fromPointX = props.from.x;
            fromPointY = props.from.y;
            Canvas.lastFromLineCoords.x = fromPointX;
            Canvas.lastFromLineCoords.y = fromPointY;
            console.log('in ', tableId);
          } else {
            fromPointX = Canvas.lastFromLineCoords.x;
            fromPointY = Canvas.lastFromLineCoords.y;
            console.log('out ', tableId);
          }
        }
        // toPoint definisce il punto di arrivo della linea (vicino alla tabella che sto draggando)
        const toPointX = e.offsetX - app.dragElementPosition.x - 10;
        const toPointY = e.offsetY - app.dragElementPosition.y + 15;
        // parametri per la bezierCurveTo
        const p1 = { x: fromPointX + 60 }
        const p2 = { x: e.offsetX - 60, y: e.offsetY }
        // memorizzo, in un oggetto Map() i parametri della linea
        Canvas.joinLines = {
          id: `line-${Canvas.joinLineId}`,
          properties: {
            'pos': {
              'x': fromPointX,
              'y': fromPointY
            },
            'cp1x': p1.x,
            'cp1y': fromPointY,
            'cp2x': p2.x,
            'cp2y': p2.y,
            'x': toPointX,
            'y': toPointY
          }
        };
        Canvas.drawLines();
      }
      Canvas.ctx.restore();
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }

  app.canvasDrop = (e) => {
    e.preventDefault();
    console.log(e.offsetX, e.offsetY);
    // e.target.classList.replace('dropping', 'dropped');
    if (!e.target.classList.contains('dropzone')) return;
    // console.log(elementId);
    const liElement = document.getElementById(e.dataTransfer.getData('text/plain'));
    // console.log(liElement);
    const div = document.createElement('div');
    // div.id = `canvas-${liElement.id}`;
    div.id = `canvas-data-${Canvas.canvas.childElementCount + 1}`;
    div.dataset.table = liElement.dataset.label;
    div.dataset.schema = liElement.dataset.schema;
    div.dataset.id = 'data-' + Canvas.canvas.childElementCount;
    // all'offsetX elimino l'offset che identifica la distanza tra il mouse e il left dell'elemento draggato
    let coords = { x: e.offsetX - app.dragElementPosition.x, y: e.offsetY - app.dragElementPosition.y }
    if (Canvas.tables.size === 0) {
      // prima tabella
      coords = { x: 40, y: 60 };
    }
    div.dataset.x = coords.x;
    div.dataset.y = coords.y;
    div.dataset.fromX = coords.x + 180;
    div.dataset.fromY = coords.y + 15;
    div.dataset.toX = coords.x - 10;
    div.dataset.toY = coords.y + 15;
    Canvas.canvas.append(div);
    let fromPointX, fromPointY;

    // coordinate per la linea in base alle tabelle presenti nel canvas
    if (Canvas.tables.size >= 1) {
      for (const [tableId, properties] of Canvas.tables) {
        if ((properties.x + 40) < e.offsetX && (properties.y - 40) < e.offsetY) {
          fromPointX = properties.from.x;
          fromPointY = properties.from.y;
          Canvas.lastFromLineCoords.x = fromPointX;
          Canvas.lastFromLineCoords.y = fromPointY;
          // Canvas.tableJoin = tableId; // tabella a cui sto legando quella attuale
          Canvas.tableJoin = Canvas.tables.get(tableId); // tabella a cui sto legando quella attuale
          console.log('in ', tableId);
        } else {
          fromPointX = Canvas.lastFromLineCoords.x;
          fromPointY = Canvas.lastFromLineCoords.y;
          // se è presente una sola tabella, la join verrà fatta con quella, cioè la prima tabella aggiunta al canvas
          if (Canvas.tables.size === 1) {
            let tableJoinId = Canvas.canvas.querySelector("div[data-id='data-0']").getAttribute('id');
            Canvas.tableJoin = Canvas.tables.get(tableJoinId);
          }
        }
      }
      console.log('tableJoin ', Canvas.tableJoin);
    }
    // console.log(Canvas.canvas.querySelector('#canvas-data-1'));
    // aggiungo la tabella appena droppata all'oggetto Map Canvas.tables
    // calcolo le coords per creare la linea di join
    if (Canvas.tables.size >= 1) {
      Canvas.tables = {
        id: `canvas-data-${Canvas.canvas.childElementCount}`,
        properties: {
          key: `canvas-data-${Canvas.canvas.childElementCount}`,
          name: liElement.dataset.label,
          x: coords.x,
          y: Canvas.tableJoin.y,
          'from': {
            'x': coords.x + 180,
            'y': Canvas.tableJoin.y + 15
          },
          'to': {
            'x': coords.x - 10,
            'y': Canvas.tableJoin.y + 15
          }
        }
      };
      console.log('tables ', Canvas.tables);
      Canvas.currentTable = Canvas.tables.get(div.id);
      Canvas.drawTable();
      // Canvas.drawTableByJoin();
      const toPointX = Canvas.currentTable.to.x;
      // const toPointY = Canvas.currentTable.to.y;
      const toPointY = Canvas.tableJoin.to.y;
      const p1 = { x: fromPointX + 40 }
      // const p2 = { x: e.offsetX - 40, y: e.offsetY }
      const p2 = { x: e.offsetX - 40, y: toPointY }
      Canvas.joinLines = {
        id: `line-${Canvas.joinLineId++}`,
        properties: {
          'pos': {
            'x': fromPointX,
            'y': fromPointY
          },
          'cp1x': p1.x,
          'cp1y': fromPointY,
          'cp2x': p2.x,
          'cp2y': p2.y,
          'x': toPointX,
          'y': toPointY
        }
      };
      Canvas.redraw();
      console.log(Canvas.joinLines);
    } else {
      Canvas.tables = {
        id: `canvas-data-${Canvas.canvas.childElementCount}`,
        properties: {
          key: `canvas-data-${Canvas.canvas.childElementCount}`,
          name: liElement.dataset.label,
          x: coords.x,
          y: coords.y,
          'from': {
            'x': coords.x + 180,
            'y': coords.y + 15
          },
          'to': {
            'x': coords.x - 10,
            'y': coords.y + 15
          }
        }
      };
      Canvas.currentTable = Canvas.tables.get(div.id);
      Canvas.drawTable();
    }
  }

  app.handlerDragStart = (e) => {
    console.log('e.target : ', e.target.id);
    console.log('e.target : ', e.currentTarget.id);
    e.target.classList.add('dragging');
    app.dragElementPosition = { x: e.offsetX, y: e.offsetY };
    // console.log(app.dragElementPosition);
    e.dataTransfer.setData('text/plain', e.target.id);
    // console.log(e.dataTransfer);
    e.dataTransfer.effectAllowed = "copy";
  }

  app.canvasDragEnd = (e) => {
    e.preventDefault();
  }

  Canvas.canvas.addEventListener('dragenter', app.canvasDragEnter, false);
  Canvas.canvas.addEventListener('dragover', app.canvasDragOver, false);
  Canvas.canvas.addEventListener('dragleave', app.canvasDragLeave, false);
  Canvas.canvas.addEventListener('dragend', app.canvasDragEnd, false);
  Canvas.canvas.addEventListener('drop', app.canvasDrop, false);




  // ctx.fillStyle = 'green';
  // ctx.fillRect(10, 10, 150, 100);
  function drawCheckbox(ctx, element, x, y, paint) {
    ctx.save();
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var metrics = ctx.measureText(element.labels[0].textContent);
    if (paint) {
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.rect(x - 5, y - 5, 10, 10);
      ctx.stroke();
      if (element.checked) {
        ctx.fillStyle = 'black';
        ctx.fill();
      }
      ctx.fillText(element.labels[0].textContent, x + 5, y);
    }
    ctx.beginPath();
    ctx.rect(x - 7, y - 7, 12 + metrics.width + 2, 14);

    ctx.drawFocusIfNeeded(element);
    ctx.restore();
  }
  function drawBase() { /* ... */ }
  function drawAs() { /* ... */ }
  function drawBs() { /* ... */ }

  function redraw() {
    ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
    drawCheckbox(ctx, document.getElementById('showA'), 20, 40, true);
    drawCheckbox(ctx, document.getElementById('showB'), 20, 60, true);
    drawBase();
    if (document.getElementById('showA').checked)
      drawAs();
    if (document.getElementById('showB').checked)
      drawBs();
  }

  function processClick(event) {
    var x = event.clientX;
    var y = event.clientY;
    var node = event.target;
    while (node) {
      x -= node.offsetLeft - node.scrollLeft;
      y -= node.offsetTop - node.scrollTop;
      node = node.offsetParent;
    }
    drawCheckbox(ctx, document.getElementById('showA'), 20, 40, false);
    if (ctx.isPointInPath(x, y))
      document.getElementById('showA').checked = !(document.getElementById('showA').checked);
    drawCheckbox(ctx, document.getElementById('showB'), 20, 60, false);
    if (ctx.isPointInPath(x, y))
      document.getElementById('showB').checked = !(document.getElementById('showB').checked);
    redraw();
  }
  // app.canvas.addEventListener('focus', redraw, true);
  // app.canvas.addEventListener('blur', redraw, true);
  // app.canvas.addEventListener('change', redraw, true);
  // app.canvas.addEventListener('click', processClick, false);
  // app.canvas.addEventListener('click', app.canvasClick, false);
  // redraw();
  /* end canvas */
  /* drag events */
  /* app.handlerDragStart = (e) => {
    console.log('e.target : ', e.target.id);
    e.target.classList.add('dragging');
    app.dragElementPosition = { x: e.offsetX, y: e.offsetY };
    // console.log(app.dragElementPosition);
    e.dataTransfer.setData('text/plain', e.target.id);
    // inizio il drag, rendo la dropzone z-index maggiore
    app.svg.style['z-index'] = 4;
    // creo la linea
    if (app.flow.querySelectorAll('.table').length > 0) {
      console.log('create line');
      app.l = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      app.l.dataset.id = app.svg.querySelectorAll('rect').length;
      app.svg.appendChild(app.l);
    }
    console.log(e.dataTransfer);
    e.dataTransfer.effectAllowed = "copy";
  } */

  /* drag events */


  document.querySelectorAll('li').forEach(el => {
    el.ondragstart = app.handlerDragStart;
  });

  /* end drag events */
  /* app.svg.addEventListener('dragover', app.handlerDragOverH, true);
  app.svg.addEventListener('dragenter', app.handlerDragEnterH, true);
  app.svg.addEventListener('dragleave', app.handlerDragLeaveH, true);
  app.svg.addEventListener('drop', app.handlerDropH, true);
  app.svg.addEventListener('dragend', app.handlerDragEndH, true); */
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
      // console.log(app.coords);
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
