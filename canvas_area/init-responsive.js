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
    if (app.svg.querySelectorAll('rect').length > 0) {
      console.log('create line');
      app.l = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      app.l.dataset.id = app.svg.querySelectorAll('rect').length;
      // app.l.setAttribute('fill', 'transparent');
      app.l.setAttribute('stroke', 'red');
      app.l.setAttribute('stroke-linecap', 'round');
      app.l.setAttribute('stroke-width', 3);
      app.svg.appendChild(app.l);
      /* app.letsdraw = {
        x: 0,
        y: 0
      } */

    }
    console.log(e.dataTransfer);
    e.dataTransfer.effectAllowed = "copy";
  }

  app.handlerDragOverH = (e) => {
    e.preventDefault();
    // console.log('dragOver:', e.target);
    if (e.target.classList.contains('dropzone')) {
      e.dataTransfer.dropEffect = "copy";
      app.letsdraw = {
        x: e.offsetX,
        y: e.offsetY
      }
      if (app.l) app.l.setAttribute('d', 'M 250 300 L ' + (e.offsetX - app.dragElementPosition.x) + ' ' + (e.offsetY - app.dragElementPosition.y));
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

  app.handlerDragEndH = async (e) => {
    e.preventDefault();
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
    // const elementId = e.dataTransfer.getData('text/plain');
    // console.log(elementId);
    const liElement = document.getElementById(e.dataTransfer.getData('text/plain'));
    console.log(liElement);
    liElement.classList.remove('dragging');
    const svgTable = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const svgTableText = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    svgTable.id = liElement.id;
    svgTable.setAttribute('class', 'table-rect');
    svgTable.setAttribute('x', app.letsdraw.x);
    svgTable.setAttribute('y', app.letsdraw.y);
    svgTableText.setAttribute('x', app.letsdraw.x + 20);
    svgTableText.setAttribute('y', app.letsdraw.y + 24);
    svgTableText.innerHTML = liElement.dataset.label;
    app.svg.appendChild(svgTable);
    app.svg.appendChild(svgTableText);
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
  app.svg.addEventListener('dragover', app.handlerDragOverH, true);
  app.svg.addEventListener('dragenter', app.handlerDragEnterH, true);
  app.svg.addEventListener('dragleave', app.handlerDragLeaveH, true);
  app.svg.addEventListener('drop', app.handlerDropH, true);
  app.svg.addEventListener('dragend', app.handlerDragEndH, true);
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
