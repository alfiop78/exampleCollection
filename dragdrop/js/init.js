(() => {
  var app = {
    table : document.getElementById('table-01'),
    dragDirection : 0 // drag da sinistra->destra effettuo  il after altrimenti il before
  };

  app.dragstart = function(e) {
    console.log('start');
    // Set the drag's format and data. Use the event target's id for the data
    // -- test 1 OK ---
    console.log(e.target.id);
    e.dataTransfer.setData("text/plain", e.target.id);
    console.log(e.dataTransfer);
    app.dragDirection = +e.target.getAttribute('col');
    // -- test 1 OK ---


  };

  app.drag = function(e) {
    console.log('drag');
    // this.style.background = 'red';
  };

  app.handlerDragOver = function(e) {
    e.preventDefault();
    // TODO: se si passa dal target 1->2 inserisco l'elemento after altrimenti before

    // e.target.style.opacity = ".2";
  };

  app.handlerDrop = function(e) {
    e.preventDefault();
    console.log('drop');

    // ---test 1 OK ---
    var data = e.dataTransfer.getData("text/plain");
    console.log(e.dataTransfer);
    let parent = e.target.parentElement;
    e.target.style.background = "initial";
    e.target.style.borderLeft = "initial";
    // console.log(e.target.id);
    let draggedEl = document.getElementById(data);
    console.log(draggedEl);
    // recupero l'id colonna dell'elemento spostato, per poter spostare tutta la colonna (righe relative alla colonna)
    let colSelected = +draggedEl.getAttribute('col');
    console.log(e.target);
    let colTarget = +e.target.getAttribute('col');
    console.log(colSelected);
    console.log(colTarget);
    (colSelected > colTarget) ? e.target.before(draggedEl) : e.target.after(draggedEl);

    // ho la colonna da spostare e la colonna target, con queste posso spostare tutte le righe appartenenti alla colonna
    // recupero le righe della tabella
    for (let i = 1; i < app.table.rows.length; i++) {
      // console.log(app.table.rows[i]);
      // recupero tutta la colonna da spostare
      // console.log(colSelected);
      // console.log(colTarget);
      let elementSelected = app.table.rows[i].cells[colSelected];
      // colonna dove fare il before, colTarget
      let colTargetElement = app.table.rows[i].cells[colTarget];
      (colSelected > colTarget) ? colTargetElement.before(elementSelected) : colTargetElement.after(elementSelected);
      
    }
    // ---test 1 OK ---

  };

  app.handlerDragEnter = function(e) {
    console.log('dragEnter');
    e.preventDefault();
    // console.log(e.target.getAttribute('col'));


    e.target.style.background = "rgba(10,10,10,0.2)";
    // e.target.style.borderLeft = "solid thick brown";
  };

  app.handlerDragLeave = function(e) {
    e.preventDefault();
    e.target.style.background = "initial";
    e.target.style.borderLeft = "initial";
  };

  app.handlerDragEnd = function(e) {
    e.preventDefault();
    console.log('end');
    // ristabilisco le position tramite l'attributo col (header) e data-id (body)
    for (let i = 0; i < app.table.rows.length; i++) {
      for (let c = 0; c < app.table.rows[i].cells.length; c++) {
        // console.log(app.table.rows[i].cells[c]);
        app.table.rows[i].cells[c].setAttribute('col', c);
      }
    }
    e.target.style.background = "initial";
  };

  document.querySelectorAll('th').forEach((th) => {
    th.ondrag = app.drag;
    th.ondragstart = app.dragstart;
    th.ondragover = app.handlerDragOver;
    th.ondrop = app.handlerDrop;
    th.ondragenter = app.handlerDragEnter;
    th.ondragleave = app.handlerDragLeave;
    th.ondragend = app.handlerDragEnd;
  });

  document.querySelectorAll('tbody td').forEach((td) => {
    // console.log(td);
    // td.ondragover = app.handlerDragOver;
    // td.ondrop = app.handlerDrop;
  });


})();
