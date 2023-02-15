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
        Draw.svg.querySelectorAll('g.table').forEach(table => {
          // console.log(table);
          if ((+table.dataset.x + 40) < e.offsetX && (+table.dataset.y - 25) < e.offsetY) {
            const rectBounding = table.getBoundingClientRect();
            Draw.tableJoin = {
              table,
              x: +table.dataset.x + rectBounding.width + 10,
              y: +table.dataset.y + (rectBounding.height / 2),
              joins: +table.dataset.joins,
              levelId: +table.dataset.levelId
            };
            app.from = { x: Draw.tableJoin.x, y: Draw.tableJoin.y };
            app.lastFrom = app.from;
          } else {
            app.from = app.lastFrom;
            // se è presente una sola tabella, la join verrà fatta con quella, cioè la prima tabella aggiunta al canvas
            if (Draw.svg.querySelectorAll('g.table').length === 1) {
              const firstTable = Draw.svg.querySelector("g.table[data-id='data-0']");
              Draw.tableJoin = { table: firstTable, x: +firstTable.dataset.x, y: +firstTable.dataset.y, levelId: 0 };
            }
          }
        });
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
          // linea con una tabella trovata a cui collegarla
          // d = `M${Draw.tableJoin.x},${Draw.tableJoin.y} C${Draw.tableJoin.x + 80},${Draw.tableJoin.y} ${e.offsetX - 80},${e.offsetY - app.dragElementPosition.y + 17.5} ${e.offsetX - app.dragElementPosition.x - 10},${e.offsetY - app.dragElementPosition.y + 17.5}`;
        } else {
          // linea senza la tabella a cui collegarla ma in base a lastFrom la posizione di start della linea inizia dall'ultima tableJoin trovata
          // d = `M${app.from.x},${app.from.y} C${app.from.x + 80},${app.from.y} ${e.offsetX - 80},${e.offsetY - app.dragElementPosition.y + 17.5} ${e.offsetX - app.dragElementPosition.x - 10},${e.offsetY - app.dragElementPosition.y + 17.5}`;
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
      if (tableInLevel !== 0) {
        // sono presenti altre tabelle per questo livello
        // recupero la posizione di tableJoin.y e incremento la posizione della tabella corrente (quindi partendo da tableJoin.y)
        coords.y = +lastTableInLevel.dataset.y + 60;
        // recupero altre tabelle presenti in questo livello > coords.y per spostarle 60 y più in basso
        Draw.svg.querySelectorAll(`g.table[data-level-id='${levelId}']`).forEach(table => {
          if (+table.dataset.y >= coords.y) {
            Draw.tables.get(table.id).y += 60;
            Draw.tables.get(table.id).line.from.y += 60;
            Draw.tables.get(table.id).line.to.y += 60;
            // riposiziono tutte le tabelle ricorsivamente
            let t = (joinTable, lvlId) => {
              // tabella in join con table.id
              // console.log(Draw.tables.get(joinTable).join);
              const tbl = Draw.tables.get(joinTable).join;
              const tableRef = Draw.svg.querySelector(`#${tbl}`);
              if (tbl) {
                console.log(tbl);
                Draw.tables.get(tbl).y += 60;
                Draw.tables.get(tbl).line.from.y += 60;
                Draw.tables.get(tbl).line.to.y += 60;
                // ci sono altre tabelle "sotto" a joinTable ?
                Draw.svg.querySelectorAll(`g.table[data-level-id='${lvlId}']`).forEach(table => {
                  if (+table.dataset.y >= +tableRef.dataset.y) {
                    Draw.tables.get(table.id).y += 60;
                    Draw.tables.get(table.id).line.from.y += 60;
                    Draw.tables.get(table.id).line.to.y += 60;
                  }
                });
                t(tbl, lvlId - 1);
              }
            }
            t(table.id);
          }
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
      if (Draw.tableJoin.joins > 1) {
        // a questa tableJoin sono legate più di una tabella. Riposiziono la tableJoin per metterla al centro rispetto il numero di join ad essa legate
        let totalY = 0;
        // la tabella corrente è legata a una tabella (Draw.tableJoin) che ha x (Draw.tableJoin.joins) tabelle già collegate
        for (const [key, value] of Draw.tables) {
          // solo le tabelle legate a Draw.tableJoin vanno sommate a totalY
          if (value.join === Draw.tableJoin.table.id) {
            totalY += value.y;
          }
        }
        Draw.tableJoin.y = (totalY / Draw.tableJoin.joins); // centro (y) del level, riferito al level successivo
        Draw.tables.get(Draw.tableJoin.table.id).y = (totalY / Draw.tableJoin.joins);
        Draw.tables.get(Draw.tableJoin.table.id).line.from.y = (totalY / Draw.tableJoin.joins) + 15;
        Draw.tables.get(Draw.tableJoin.table.id).line.to.y = (totalY / Draw.tableJoin.joins) + 15;
        // TODO: quando sposto la tableJoin devo verificare se, nello stesso livello, ci sono altre tabelle, in questo caso devo spostarle tutte in riferimento alla y di tableJoin
        // recupero le tabelle presenti sullo stesso livello di tableJoin
        /* const tablesInLevel = Draw.svg.querySelectorAll(`g.table[data-level-id='${+Draw.tableJoin.table.dataset.levelId}']`);
        // const lastLevel = Draw.svg.querySelectorAll(``);
        for (let i = +Draw.svg.dataset.level; i >= 0; i--) {
          console.log(i);
          debugger;
          // TODO: centro le tabelle del livello precedente a i
          const tablesInLevel = Draw.svg.querySelectorAll(`g.table[data-level-id='${i}']`);
          tablesInLevel.forEach(table => {
            console.log(table);
          });
        } */
      }
      Draw.joinLines = {
        id: Draw.currentLineRef.id, properties: {
          id: Draw.currentLineRef.dataset.id,
          key: Draw.currentLineRef.id,
          from: Draw.tableJoin.table.id,
          to: `svg-data-${tableId}`
        }
      };
    }
    Draw.currentTable = Draw.tables.get(`svg-data-${tableId}`);
    Draw.drawTable();
    Draw.repositioning();
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



