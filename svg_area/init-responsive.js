var Draw = new DrawSVG('svg');
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
    coordsRef: document.getElementById('coords'),
    windowJoin: document.getElementById('window-join')
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
  observerList.observe(document.getElementById('body'), config);
  // observerList.observe(Draw.svg, config);

  /* drag events */

  app.handlerDragStart = (e) => {
    console.log('e.target : ', e.target.id);
    e.target.classList.add('dragging');
    app.dragElementPosition = { x: e.offsetX, y: e.offsetY };
    // console.log(app.dragElementPosition);
    e.dataTransfer.setData('text/plain', e.target.id);
    // creo la linea
    if (Draw.svg.querySelectorAll('.table').length > 0) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.id = `line-${Draw.svg.querySelectorAll('g.table').length}`;
      line.dataset.id = Draw.svg.querySelectorAll('g.table').length;
      Draw.svg.appendChild(line);
      Draw.currentLineRef = line.id;
    }
    // console.log(e.dataTransfer);
    e.dataTransfer.effectAllowed = "copy";
  }

  app.handlerDragOver = (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('dropzone')) {
      e.dataTransfer.dropEffect = "copy";
      app.coordsRef.innerHTML = `<small>x ${e.offsetX}</small><br /><small>y ${e.offsetY}</small>`;
      if (Draw.svg.querySelectorAll('.table').length > 0) {
        // TODO: da commentare
        let nearestTable = [...Draw.svg.querySelectorAll('g.table')].reduce((prev, current) => {
          return (Math.hypot(e.offsetX - (+current.dataset.x + 180), e.offsetY - (+current.dataset.y + 15)) < Math.hypot(e.offsetX - (+prev.dataset.x + 180), e.offsetY - (+prev.dataset.y + 15))) ? current : prev;
        });
        console.log(nearestTable.id);
        const rectBounding = nearestTable.getBoundingClientRect();
        Draw.tableJoin = {
          table: nearestTable,
          x: +nearestTable.dataset.x + rectBounding.width + 10,
          y: +nearestTable.dataset.y + (rectBounding.height / 2),
          joins: +nearestTable.dataset.joins,
          levelId: +nearestTable.dataset.levelId
        }
        // console.log('joinTable :', Draw.tableJoin);
        // console.log('tableJoin :', Draw.tableJoin.table.id);
        if (Draw.currentLineRef && Draw.tableJoin) {
          Draw.joinLines = {
            id: Draw.currentLineRef.id, properties: {
              id: Draw.currentLineRef.dataset.id,
              key: Draw.currentLineRef.id,
              from: Draw.tableJoin.table.id,
              to: { x: (e.offsetX - app.dragElementPosition.x - 10), y: (e.offsetY - app.dragElementPosition.y + 17.5) } // in questo caso non c'è l'id della tabella perchè questa deve essere ancora droppata, metto le coordinate e.offsetX, e.offsetY
            }
          };
          Draw.currentLine = Draw.joinLines.get(Draw.currentLineRef.id);
        }
        Draw.drawLine();
      }
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }

  app.handlerDragEnter = (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('dropzone')) {
      console.info('DROPZONE');
      // console.log(e.currentTarget, e.target);
      if (e.target.nodeName === 'rect') Draw.currentLevel = +e.target.dataset.levelId;
      // Draw.currentLevel = e.targe
      // e.dataTransfer.dropEffect = "copy";
      // coloro il border differente per la dropzone
      e.currentTarget.classList.add('dropping');
    } else {
      console.warn('non in dropzone');
      // TODO: se non sono in una dropzone modifico l'icona del drag&drop (icona "non consentito")
      e.dataTransfer.dropEffect = "none";
    }
  }

  app.handlerDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dropping');
  }

  app.handlerDragEnd = (e) => {
    e.preventDefault();
  }

  app.handlerDrop = (e) => {
    e.preventDefault();
    // console.clear();
    e.currentTarget.classList.replace('dropping', 'dropped');
    if (!e.currentTarget.classList.contains('dropzone')) return;
    // const elementId = e.dataTransfer.getData('text/plain');
    const liElement = document.getElementById(e.dataTransfer.getData('text/plain'));
    liElement.classList.remove('dragging');
    const tableId = Draw.svg.querySelectorAll('g.table').length;
    // let coords = { x: e.offsetX - app.dragElementPosition.x, y: e.offsetY - app.dragElementPosition.y }
    let coords;
    // se non è presente una tableJoin significa che sto aggiungendo la prima tabella
    if (!Draw.tableJoin) {
      coords = { x: 40, y: 60 };
      Draw.tables = {
        id: `svg-data-${tableId}`, properties: {
          id: tableId,
          key: `svg-data-${tableId}`,
          x: coords.x,
          y: coords.y,
          line: {
            from: { x: coords.x + 180, y: coords.y + 15 },
            to: { x: coords.x - 10, y: coords.y + 15 }
          },
          table: liElement.dataset.label,
          schema: liElement.dataset.schema,
          join: null,
          joins: 0,
          levelId: 0
        }
      };
    } else {
      // è presente una tableJoin
      // imposto data.joins anche sull'elemento SVG
      Draw.svg.querySelector(`g.table[id="${Draw.tableJoin.table.id}"]`).dataset.joins = ++Draw.tableJoin.joins;
      // ... lo imposto anche nell'oggetto Map() tables
      Draw.tables.get(Draw.tableJoin.table.id).joins = Draw.tableJoin.joins;
      // livello che sto aggiungendo
      const levelId = Draw.tableJoin.levelId + 1;
      // creo un array dei livelli, ordinato in reverse per poter fare un ciclo dal penultimo livello fino al primo ed effettuare il posizionamento automatico
      if (!Draw.arrayLevels.includes(Draw.tableJoin.levelId)) Draw.arrayLevels.splice(0, 0, Draw.tableJoin.levelId);
      // if (!Draw.arrayLevels.includes(levelId)) Draw.arrayLevels.splice(0, 0, levelId);
      Draw.svg.dataset.level = (Draw.svg.dataset.level < levelId) ? levelId : Draw.svg.dataset.level;
      // quante tabelle ci sono per il livello corrente che appartengono alla stessa tableJoin
      const tableRelated = Draw.svg.querySelectorAll(`g.table[data-level-id='${levelId}'][data-table-join='${Draw.tableJoin.table.id}']`);
      const tableInLevel = tableRelated.length;
      let lastTableInLevel;
      // recupero la posizione dell'ultima tabella appartenete al livello corrente e legata alla stessa tableJoin
      tableRelated.forEach(table => {
        if (lastTableInLevel) {
          if (+lastTableInLevel.dataset.y < +table.dataset.y) lastTableInLevel = table;
        } else {
          lastTableInLevel = table;
        }
      });
      let coords = { x: +Draw.tableJoin.table.dataset.x + 275, y: +Draw.tableJoin.table.dataset.y };
      // tabella aggiunta per questo livello, la imposto nella stessa y di tableJoin
      if (lastTableInLevel) {
        // sono presenti altre tabelle per questo livello
        // recupero la posizione dell'ultima tabella relativa a questa join, aggiungo la tabella corrente a +60y dopo l'ultima tabella trovata
        // lastTableInLevel è ricavata da tableRelated (tabelle con tableJoin uguale a quella che sto droppando)
        coords.y = +lastTableInLevel.dataset.y + 60;
        // recupero altre tabelle presenti in questo livello > coords.y per spostarle 60 y più in basso
        Draw.arrayLevels.forEach(levelId => {
          // incremento il levelId perchè, in questo caso (a differenza di joinTablePositioning()) devo iniziare dall'ultimo levelId
          levelId++;
          // per ogni livello, partendo dall'ultimo
          console.log(levelId);
          // se sono presenti, in questo livello, tabelle con y > di quella che sto droppando le devo spostare y+60
          Draw.svg.querySelectorAll(`g.table[data-level-id='${levelId}']`).forEach(table => {
            // console.log(`Livello ${levelId}`);
            // console.log(`tabelle ${table.id}`);
            if (+table.dataset.y >= coords.y) {
              Draw.tables.get(table.id).y += 60;
              Draw.tables.get(table.id).line.from.y += 60;
              Draw.tables.get(table.id).line.to.y += 60;
              Draw.currentTable = Draw.tables.get(table.id);
              Draw.autoPosition();
            }
          });
        });
      }
      Draw.tables = {
        id: `svg-data-${tableId}`, properties: {
          id: tableId,
          key: `svg-data-${tableId}`,
          x: coords.x,
          y: coords.y,
          line: {
            from: { x: coords.x + 180, y: coords.y + 15 },
            to: { x: coords.x - 10, y: coords.y + 15 }
          },
          table: liElement.dataset.label,
          schema: liElement.dataset.schema,
          joins: 0,
          join: Draw.tableJoin.table.id,
          levelId
        }
      };
      // linea di join da tableJoin alla tabella droppata
      Draw.joinLines = {
        id: Draw.currentLineRef.id, properties: {
          id: Draw.currentLineRef.dataset.id,
          key: Draw.currentLineRef.id,
          from: Draw.tableJoin.table.id,
          to: `svg-data-${tableId}`
        }
      };
      console.info('create JOIN');
      app.openJoinWindow();
    }
    Draw.currentTable = Draw.tables.get(`svg-data-${tableId}`);
    // creo nel DOM la tabella appena droppata
    Draw.drawTable();
    // posizionamento delle joinTable (tabelle che hanno data-join > 1)
    Draw.joinTablePositioning();
  }

  /* drag events */

  document.querySelectorAll('li').forEach(el => {
    el.ondragstart = app.handlerDragStart;
  });

  Draw.svg.addEventListener('mousemove', (e) => {
    app.coordsRef.innerHTML = `<small>x ${e.offsetX}</small><br /><small>y ${e.offsetY}</small>`;
  }, true);

  /* end drag events */
  Draw.svg.addEventListener('dragover', app.handlerDragOver, false);
  Draw.svg.addEventListener('dragenter', app.handlerDragEnter, false);
  Draw.svg.addEventListener('dragleave', app.handlerDragLeave, false);
  Draw.svg.addEventListener('drop', app.handlerDrop, false);
  Draw.svg.addEventListener('dragend', app.handlerDragEnd, false);
  /* end drag events */

  /* page init  (impostazioni inziali per la pagina, alcune sono necessarie per essere catturate dal mutationObserve)*/
  // TODO: da implementare
  // app.dialogConnection.showModal();
  /* end page init */

  /*onclick events*/
  app.tableSelected = (e) => {
    console.log(`table selected ${e.currentTarget.dataset.table}`);
  }

  app.lineSelected = (e) => {
    console.log(`line selected ${e.currentTarget.dataset.from} -> ${e.currentTarget.dataset.to}`);
  }

  app.openJoinWindow = () => {
    app.windowJoin.dataset.open = 'true';
    console.log(Draw.currentLineRef);
    console.log(Draw.currentLineRef.id);
    console.log(Draw.joinLines.get(Draw.currentLineRef.id));
    const from = Draw.joinLines.get(Draw.currentLineRef.id).from;
    const to = Draw.joinLines.get(Draw.currentLineRef.id).to;
    debugger;
    app.windowJoin.querySelector('span[data-table-from]').innerHTML = from;
    app.windowJoin.querySelector('span[data-table-to]').innerHTML = to;
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

  app.windowJoin.onmousedown = (e) => {
    app.coords = { x: +e.currentTarget.dataset.x, y: +e.currentTarget.dataset.y };
    app.el = e.currentTarget;
  }

  app.windowJoin.onmousemove = (e) => {
    if (app.el) {
      app.coords.x += e.movementX;
      app.coords.y += e.movementY;
      e.currentTarget.style.transform = "translate(" + app.coords.x + "px, " + app.coords.y + "px)";
      e.currentTarget.dataset.x = app.coords.x;
      e.currentTarget.dataset.y = app.coords.y;
    }
  }

  app.windowJoin.onmouseup = () => delete app.el;

  /* end mouse events */

})();



