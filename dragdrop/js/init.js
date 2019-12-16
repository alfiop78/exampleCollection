(() => {
  var app = {
    dragged : null,
    table : document.getElementById('table-01')
  };

  app.dragstart = function(e) {
    console.log('start');
    // Set the drag's format and data. Use the event target's id for the data
    // -- test 1 OK ---
    // console.log(e.target.id);
    // e.dataTransfer.setData("text/plain", e.target.id);
    // console.log(e.dataTransfer);
    // -- test 1 OK ---
    // --tesst 2
    app.dragged = e.target;

    console.log(app.dragged);
    // --tesst 2

  };

  app.drag = function(e) {
    console.log('drag');
    // this.style.background = 'red';
  };

  app.handlerDragOver = function(e) {
    e.preventDefault();
    // e.target.style.opacity = ".2";
  };

  app.handlerDrop = function(e) {
    e.preventDefault();
    console.log('drop');

    // ---test 1 OK ---
    // var data = e.dataTransfer.getData("text/plain");
    // // console.log(e.target.parentNode);
    // let parent = e.target.parentElement;
    e.target.style.background = "initial";
    e.target.style.borderLeft = "initial";
    // // console.log(e.target.id);
    // e.target.before(document.getElementById(data));
    // ---test 1 OK ---

    // test 2
    e.target.before( app.dragged );
    // imposto le posizioni


    let colSelected = +app.dragged.getAttribute('col');
    let targetColumns = +e.target.getAttribute('col');
    console.log(e.target);
    console.log(targetColumns);

    // TODO: prendo tutti gli elementi td della colonna x
    for (let i = 1; i < app.table.rows.length; i++) {

      // console.log(app.table.rows[i].cells[colSelected]);
      // console.log(app.table.rows[i].cells[targetColumns]);
      // console.log(i);
      let t = app.table.rows[i].cells[targetColumns];
      t.before(app.table.rows[i].cells[colSelected]);
    }


    // test 2

  };

  app.handlerDragEnter = function(e) {
    e.preventDefault();
    e.target.style.background = "rgba(10,10,10,0.2)";
    e.target.style.borderLeft = "solid thick brown";
  };

  app.handlerDragLeave = function(e) {
    e.preventDefault();
    e.target.style.background = "initial";
    e.target.style.borderLeft = "initial";
  };

  app.handlerDragEnd = function(e) {
    e.preventDefault();
    console.log('end');
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
