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
    canvas: document.getElementById('canvas'),
    tables: new Map(),
    tableId: 0,
    joinLines: new Map(),
    joinLinesId: 1
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
  const canvas = document.querySelector('canvas');
  canvas.width = app.translate.offsetWidth;
  canvas.height = app.translate.offsetHeight;
  const ctx = canvas.getContext('2d');

  canvas.addEventListener('click', (e) => {
    // const isPointInPath = ctx.isPointInPath(app.table, e.offsetX, e.offsetY);
    // console.log(isPointInPath);
  }, true);

  canvas.addEventListener('mousemove', (e) => {
    /* const isPointInPath = ctx.isPointInPath(app.table, e.offsetX, e.offsetY);
    ctx.fillStyle = isPointInPath ? '#3f3f4036' : 'gainsboro'; */

    // Draw table rect
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fill(app.table);
  }, true);

  app.canvasDragEnter = (e) => {
    e.preventDefault();
    // console.log('dragEnter');
    console.log(e.offsetX, e.offsetY);
  }

  app.canvasDragLeave = (e) => {
    e.preventDefault();
    // console.log('dragLeave');
    console.log(e.offsetX, e.offsetY);
  }

  app.canvasDragOver = (e) => {
    e.preventDefault();
    // console.log('dragOver');
    // console.log(e.offsetX, e.offsetY);
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ridisegno i buttons aggiunti all'oggetto Map() app.tables
    app.createButtons();
    if (app.tables.size !== 0) {
      const startLineX = app.tables.get('table-' + app.joinLinesId).from.x;
      const startLineY = app.tables.get('table-' + app.joinLinesId).from.y;
      const p1 = { x: startLineX + 150 }
      const p2 = { x: e.offsetX - 150, y: e.offsetY }
      app.joinLines.set('line-' + (app.joinLinesId), { 'pos': { 'x': startLineX, 'y': startLineY }, 'cp1x': p1.x, 'cp1y': startLineY, 'cp2x': p2.x, 'cp2y': p2.y, 'x': e.offsetX, 'y': e.offsetY });
      app.drawLines();
    }
    ctx.restore();
  }

  app.createButtons = () => {
    // creo, oppure, ricreo tutte le table presenti nel canvas
    for (const [tableId, coords] of app.tables) {
      // console.log(tableId, coords.x, coords.y);
      ctx.beginPath();
      ctx.roundRect(coords.x - 20, coords.y, 170, 30, 4);
      const ctxTable = new Path2D();
      ctx.beginPath();
      ctxTable.roundRect(coords.x - 20, coords.y, 170, 30, 4);
      ctx.fillStyle = "gainsboro";
      ctx.fill(ctxTable);
      ctxTable.roundRect(coords.x - 20, coords.y, 170, 30, 4);
      ctxTable.id = 'e';
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = 'gray';
      ctx.stroke(ctxTable);
      ctx.closePath();
      ctx.font = '0.8rem sans-serif';
      ctx.fillStyle = '#494949';
      ctx.fillText(tableId, coords.x, coords.y + 20);
      // startpoint / endpoint
      ctx.beginPath();
      ctx.fillStyle = 'dimgray';
      ctx.arc(coords.x - 30, coords.y + 15, 2, 0, 6);
      ctx.fill(); // cerchio senza colore di riempimento
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(coords.x + 160, coords.y + 15, 2, 0, 6);
      // ctx.stroke(); // cerchio senza colore di riempimento
      ctx.fill();
      ctx.closePath();
    }
  }

  app.drawLines = () => {
    // se non sono presenti tabelle non disegno la linea
    if (app.tables.size === 0) return;
    const ctxLine = new Path2D();
    for (const [lineId, coords] of app.joinLines) {
      ctx.beginPath();
      ctx.strokeStyle = 'darkorange';
      ctx.lineWidth = 3;
      ctxLine.moveTo(coords.pos.x, coords.pos.y);
      // ctxLine.moveTo(p0.x, p0.y);
      // ctxLine.bezierCurveTo(p1.x, 115, p2.x - 150, p2.y, p2.x, p2.y);
      ctxLine.bezierCurveTo(coords.cp1x, coords.cp1y, coords.cp2x, coords.cp2y, coords.x, coords.y);
      ctx.stroke(ctxLine);
    }
  }

  app.canvasDrop = (e) => {
    e.preventDefault();
    console.log('drop');
    console.log(e.offsetX, e.offsetY);
    // e.target.classList.replace('dropping', 'dropped');
    if (!e.target.classList.contains('dropzone')) return;
    // console.log(elementId);
    const liElement = document.getElementById(e.dataTransfer.getData('text/plain'));
    console.log(liElement);
    const div = document.createElement('div');
    div.id = liElement.id;
    div.dataset.label = liElement.dataset.label;
    // console.log(app.canvas.childElementCount);
    div.dataset.id = 'table-' + app.canvas.childElementCount;
    div.dataset.x = e.offsetX;
    div.dataset.y = e.offsetY;
    div.dataset.fromX = e.offsetX + 160;
    div.dataset.fromY = e.offsetY + 15;
    div.dataset.toX = e.offsetX - 30;
    div.dataset.toY = e.offsetY + 15;
    app.canvas.append(div);
    /* app.createButtons();
    if (app.canvas.childElementCount > 1) {
      const fromX = app.tables.get('table-' + app.joinLinesId).from.x;
      const fromY = app.tables.get('table-' + app.joinLinesId).from.y;
      const toX = app.tables.get('table-' + app.tableId).to.x;
      const toY = app.tables.get('table-' + app.tableId).to.y;
      const p1 = { x: startLineX + 150 }
      const p2 = { x: e.offsetX - 150, y: e.offsetY }
      app.joinLines.set('line-' + (app.joinLinesId++), { 'pos': { 'x': startLineX, 'y': startLineY }, 'cp1x': p1.x, 'cp1y': startLineY, 'cp2x': p2.x, 'cp2y': p2.y, 'x': toX, 'y': toY });
      console.log(app.joinLines);
    } */

    app.tableId++;
    app.tables.set('table-' + app.tableId, {
      x: e.offsetX, y: e.offsetY,
      'from': {
        'x': e.offsetX + 160,
        'y': e.offsetY + 15
      },
      'to': {
        'x': e.offsetX - 30,
        'y': e.offsetY + 15
      }
    });
    console.log(app.tables);
    app.createButtons();
    if (app.tables.size > 1) {
      const startLineX = app.tables.get('table-' + app.joinLinesId).from.x;
      const startLineY = app.tables.get('table-' + app.joinLinesId).from.y;
      const toX = app.tables.get('table-' + app.tableId).to.x;
      const toY = app.tables.get('table-' + app.tableId).to.y;
      const p1 = { x: startLineX + 150 }
      const p2 = { x: e.offsetX - 150, y: e.offsetY }
      app.joinLines.set('line-' + (app.joinLinesId++), { 'pos': { 'x': startLineX, 'y': startLineY }, 'cp1x': p1.x, 'cp1y': startLineY, 'cp2x': p2.x, 'cp2y': p2.y, 'x': toX, 'y': toY });
      // app.joinLines.set('line-' + (app.joinLinesId++), { 'pos': { 'x': startLineX, 'y': startLineY }, 'cp1x': p1.x, 'cp1y': startLineY, 'cp2x': p2.x, 'cp2y': p2.y, 'x': e.offsetX, 'y': e.offsetY });
      // app.joinLines.set('line-' + (app.joinLinesId++), { 'pos': { 'x': p0.x, 'y': p0.y }, 'cp1x': p1.x, 'cp1y': 115, 'cp2x': p2.x - 150, 'cp2y': p2.y, 'x': p2.x, 'y': p2.y });
      console.log(app.joinLines);
    }
  }

  app.handlerDragStart = (e) => {
    console.log('e.target : ', e.target.id);
    e.target.classList.add('dragging');
    app.dragElementPosition = { x: e.offsetX, y: e.offsetY };
    // console.log(app.dragElementPosition);
    e.dataTransfer.setData('text/plain', e.target.id);
    console.log(e.dataTransfer);
    e.dataTransfer.effectAllowed = "copy";
  }






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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  // canvas.addEventListener('focus', redraw, true);
  // canvas.addEventListener('blur', redraw, true);
  // canvas.addEventListener('change', redraw, true);
  // canvas.addEventListener('click', processClick, false);
  // canvas.addEventListener('click', app.canvasClick, false);
  canvas.addEventListener('dragenter', app.canvasDragEnter, false);
  canvas.addEventListener('dragover', app.canvasDragOver, false);
  canvas.addEventListener('dragleave', app.canvasDragLeave, false);
  canvas.addEventListener('dragend', app.canvasDragEnd, false);
  canvas.addEventListener('drop', app.canvasDrop, false);
  canvas.addEventListener('drop', app.canvasDrop, false);
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

  app.handlerDragOverH = (e) => {
    e.preventDefault();
    // console.log('dragOver:', e.target);
    if (e.target.classList.contains('dropzone')) {
      e.dataTransfer.dropEffect = "copy";
      app.letsdraw = {
        x: e.offsetX,
        y: e.offsetY
      }
      // cerco le card con left minore della posizione corrente del mouse
      let prevPosition;
      app.flow.querySelectorAll('.table').forEach(tbl => {
        if (tbl.dataset.x < e.offsetX) {
          prevPosition = { x: tbl.dataset.x, y: tbl.dataset.y };
        }
      });
      // console.log(app.letsdraw);
      if (app.l && prevPosition) app.l.setAttribute('d', 'M ' + prevPosition.x + ' ' + prevPosition.y + ' L ' + (e.offsetX - app.dragElementPosition.x) + ' ' + (e.offsetY - app.dragElementPosition.y));
      // if (app.l) app.l.setAttribute('d', 'M 250 300 L ' + (e.offsetX - app.dragElementPosition.x) + ' ' + (e.offsetY - app.dragElementPosition.y));
      // if (app.l) app.l.setAttribute('d', 'M ' + app.letsdraw.x + ' ' + app.letsdraw.y + ' L ' + (e.offsetX - app.dragElementPosition.x) + ' ' + (e.offsetY - app.dragElementPosition.y));
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }

  app.handlerDragEnterCard = (e) => {
    console.log('dragEnter Card');
  }

  app.handlerDragEnterH = (e) => {
    console.log('handlerDragEnter :', e.target);
    e.preventDefault();
    if (e.target.classList.contains('dropzone')) {
      console.info('DROPZONE');
      // e.dataTransfer.dropEffect = "copy";
      // coloro il border differente per la dropzone
      e.target.classList.add('dropping');
      const breakLine = document.getElementById('break-line-1');
      console.log(e.offsetX, breakLine.getAttribute('x1'));
      if (e.offsetX > breakLine.getAttribute('x1')) {
        console.log('level 2');
      }
      /* app.letsdraw = {
        x: ,
        y: 
      } */
      // console.log(app.letsdraw);
      // app.line.setAttribute('d', 'M ' + app.letsdraw.x + ' ' + app.letsdraw.y + ' L ' + e.offsetX + ' ' + e.offsetY);
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

  app.handlerDragEndH = (e) => {
    debugger;
    e.preventDefault();
    app.svg.style['z-index'] = 1;
    // faccio il DESCRIBE della tabella
    // controllo lo stato di dropEffect per verificare se il drop è stato completato correttamente, come descritto qui:https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#drag_end
    // in app.getTable() vengono utilizzate le property della classe Cube (cube.card.schema, cube.card.tableName);
    if (e.dataTransfer.dropEffect === 'copy') {
      // imposto prima la <ul> altrimenti si verifica il bug riportato nella issue#50
    }
  }

  app.handlerDropH = (e) => {
    e.preventDefault();
    e.target.classList.replace('dropping', 'dropped');
    if (!e.target.classList.contains('dropzone')) return;
    app.svg.style['z-index'] = 1;
    console.log(app.letsdraw);
    // const elementId = e.dataTransfer.getData('text/plain');
    // console.log(elementId);
    const liElement = document.getElementById(e.dataTransfer.getData('text/plain'));
    console.log(liElement);
    liElement.classList.remove('dragging');
    const flow = document.getElementById('flow');
    let table = document.createElement('div');
    table.classList.add('table');
    table.innerHTML = liElement.dataset.label;
    table.style.left = app.letsdraw.x + 'px';
    table.style.top = app.letsdraw.y + 'px';
    table.dataset.x = app.letsdraw.x;
    table.dataset.y = app.letsdraw.y;
    flow.appendChild(table);
    /* const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    marker.id = "mark1";
    marker.setAttribute('markerWidth', 5);
    marker.setAttribute('markerHeight', 5);
    marker.setAttribute('refX', 5);
    marker.setAttribute('refY', 5);
    marker.setAttribute('viewBox', '0 0 10 10');
    circle.setAttribute('cx', 5);
    circle.setAttribute('cy', 5);
    circle.setAttribute('r', 5);
    circle.setAttribute('fill', 'blue');
    marker.appendChild(circle);
    app.svg.appendChild(marker); */
    /* <marker
      id="dot"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="5"
      markerHeight="5">
      <circle cx="5" cy="5" r="5" fill="red" />
    </marker> */
    /* const svgTable = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const svgTableText = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    svgTable.id = liElement.id;
    svgTable.setAttribute('class', 'table-rect');
    svgTable.setAttribute('x', app.letsdraw.x);
    svgTable.setAttribute('y', app.letsdraw.y);
    svgTableText.setAttribute('x', app.letsdraw.x + 20);
    svgTableText.setAttribute('y', app.letsdraw.y + 24);
    svgTableText.innerHTML = liElement.dataset.label;
    app.svg.appendChild(svgTable);
    app.svg.appendChild(svgTableText); */

    /* span.innerHTML = liElement.dataset.label;
    card.dataset.label = liElement.dataset.label;
    card.dataset.schema = liElement.dataset.schema;
    card.dataset.level = app.hierarchy.childElementCount;
    e.target.appendChild(card); */
    /* if (app.l) {
      span.dataset.lineId = app.l.dataset.id;
      app.l.dataset.level = app.hierarchy.childElementCount;
      // let span = card.querySelector('span');
      app.hierarchy.querySelectorAll(".card-area[data-level='" + app.hierarchy.childElementCount + "']").forEach(card => {
        const line = app.svg.querySelector("path[data-level='" + app.hierarchy.childElementCount + "'][data-id='" + span.dataset.lineId + "']");
        line.setAttribute('stroke', 'orange');
        line.setAttribute('d', 'M ' + app.letsdraw.x + ' ' + app.letsdraw.y + ' L ' + card.querySelector('.table').offsetParent.offsetLeft + ' ' + (card.querySelector('.table').offsetParent.offsetTop + (span.offsetParent.offsetHeight / 2)));
      });
    } */
  }

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
