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
    currentLine: null,
    coordsRef: document.getElementById('coords')
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

  /* drag events */

  app.handlerDragStart = (e) => {
    console.log('e.target : ', e.target.id);
    e.target.classList.add('dragging');
    app.dragElementPosition = { x: e.offsetX, y: e.offsetY };
    console.log(app.dragElementPosition);
    e.dataTransfer.setData('text/plain', e.target.id);
    // creo la linea
    if (app.svg.querySelectorAll('.table').length > 0) {
      app.currentLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      app.currentLine.dataset.id = app.svg.querySelectorAll('g.table').length;
      app.svg.appendChild(app.currentLine);
    }
    console.log(e.dataTransfer);
    e.dataTransfer.effectAllowed = "copy";
  }

  app.handlerDragOver = (e) => {
    e.preventDefault();
    if (e.target.classList.contains('dropzone')) {
      e.dataTransfer.dropEffect = "copy";
      app.coordsRef.innerHTML = `<small>x ${e.offsetX}</small><br /><small>y ${e.offsetY}</small>`;
      if (app.svg.querySelectorAll('.table').length > 0) {
        let joinTable;
        app.svg.querySelectorAll('g.table').forEach(table => {
          // console.log(table);
          if ((+table.dataset.x + 40) < e.offsetX && (+table.dataset.y - 40) < e.offsetY) {
            const rectBounding = table.getBoundingClientRect();
            joinTable = { table, x: +table.dataset.x + rectBounding.width + 10, y: +table.dataset.y + (rectBounding.height / 2) };
            console.log(`joinTable : ${joinTable}`);
            app.from = { x: joinTable.x, y: joinTable.y };
            app.lastFrom = app.from;
          } else {
            app.from = app.lastFrom;
          }
        });
        let d;
        if (app.currentLine && joinTable) {
          // dx1, dy1 dx2, dy2 dx, dy
          // linea con una tabella trovata a cui collegarla
          d = `M${joinTable.x},${joinTable.y} C${joinTable.x + 80},${joinTable.y} ${e.offsetX - 80},${e.offsetY - app.dragElementPosition.y + 17.5} ${e.offsetX - app.dragElementPosition.x - 10},${e.offsetY - app.dragElementPosition.y + 17.5}`;
        } else {
          // linea senza la tabella a cui collegarla ma in base a lastFrom la posizione di start della linea inizia dall'ultima tableJoin trovata
          d = `M${app.from.x},${app.from.y} C${app.from.x + 80},${app.from.y} ${e.offsetX - 80},${e.offsetY - app.dragElementPosition.y + 17.5} ${e.offsetX - app.dragElementPosition.x - 10},${e.offsetY - app.dragElementPosition.y + 17.5}`;
        }
        app.currentLine.setAttribute('d', d);
      }
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }

  app.handlerDragEnterCard = (e) => {
    console.log('dragEnter Card');
  }

  app.handlerDragEnter = (e) => {
    console.log('handlerDragEnter :', e.target);
    e.preventDefault();
    if (e.target.classList.contains('dropzone')) {
      console.info('DROPZONE');
      // e.dataTransfer.dropEffect = "copy";
      // coloro il border differente per la dropzone
      e.target.classList.add('dropping');
      /* const breakLine = document.getElementById('break-line-1');
      console.log(e.offsetX, +breakLine.getAttribute('x1'));
      if (e.offsetX > breakLine.getAttribute('x1')) {
        console.log('level 2');
      } */
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

  app.handlerDragLeave = (e) => {
    console.log('dragLeave : ', e.target);
    e.preventDefault();
    e.target.classList.remove('dropping');
  }

  app.handlerDragLeaveCard = (e) => {
    e.preventDefault();
  }

  app.handlerDragEnd = (e) => {
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

  app.createTable = (element, id, coords) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = `svg-data-${id}`;
    g.dataset.id = `data-${id}`;
    g.classList.add('table');
    g.dataset.table = element.dataset.label;
    g.dataset.schema = element.dataset.schema;
    g.setAttribute('x', coords.x);
    g.setAttribute('y', coords.y);
    g.dataset.x = coords.x;
    g.dataset.y = coords.y;
    app.svg.appendChild(g);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', coords.x);
    rect.setAttribute('y', coords.y);
    g.appendChild(rect);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.innerHTML = element.dataset.label;
    text.setAttribute('x', coords.x + 24);
    text.setAttribute('y', coords.y + 17.5);
    // text.setAttribute('fill', '#494949');
    // text.setAttribute('text-anchor', 'start');
    text.setAttribute('dominant-baseline', 'middle');
    g.appendChild(text);
  }

  app.handlerDrop = (e) => {
    e.preventDefault();
    e.target.classList.replace('dropping', 'dropped');
    if (!e.target.classList.contains('dropzone')) return;
    console.log(app.letsdraw);
    // const elementId = e.dataTransfer.getData('text/plain');
    const liElement = document.getElementById(e.dataTransfer.getData('text/plain'));
    liElement.classList.remove('dragging');
    const tableId = +app.svg.querySelectorAll('g.table').length;
    let coords = { x: e.offsetX - app.dragElementPosition.x, y: e.offsetY - app.dragElementPosition.y }
    if (app.svg.querySelectorAll('g.table').length === 0) coords = { x: 40, y: 60 };
    app.createTable(liElement, tableId, coords);
  }

  /* drag events */

  document.querySelectorAll('li').forEach(el => {
    el.ondragstart = app.handlerDragStart;
  });

  app.svg.addEventListener('mousemove', (e) => {
    app.coordsRef.innerHTML = `<small>x ${e.offsetX}</small><br /><small>y ${e.offsetY}</small>`;
  }, true);

  /* end drag events */
  app.svg.addEventListener('dragover', app.handlerDragOver, true);
  app.svg.addEventListener('dragenter', app.handlerDragEnter, true);
  app.svg.addEventListener('dragleave', app.handlerDragLeave, true);
  app.svg.addEventListener('drop', app.handlerDrop, true);
  app.svg.addEventListener('dragend', app.handlerDragEnd, true);
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



