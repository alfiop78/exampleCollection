class DrawCanvas {
  #tables = new Map();
  #joinLines = new Map();

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
    // accessibili dall'esterno
    // Object che contiene la lista delle tabelle Path2d
    this.ctxTablesObject = {};
    this.joinLineId = 1;
    // consente di spostarmi, durante il drag&drop anche oltre (-x, -y) le tables già presenti nel Canvas
    this.lastFromLineCoords = {};
  }

  set tables(value) {
    this.#tables.set(value.id, value.properties);
  }

  get tables() { return this.#tables; }

  set joinLines(value) {
    this.#joinLines.set(value.id, value.properties);
  }

  get joinLines() { return this.#joinLines; }

  drawTables() {
    // creo, oppure, ricreo tutte le table presenti nel canvas
    for (const [tableId, properties] of this.#tables) {
      // console.log(tableId, value);
      this.ctx.beginPath();
      const table = new Path2D();
      // ctx.roundRect(value.x, value.y, 170, 30, 4);
      this.ctx.beginPath();

      table.roundRect(properties.x, properties.y, 170, 30, 4);
      this.ctx.fillStyle = "gainsboro";
      this.ctx.fill(table);
      // table.roundRect(value.x, value.y, 170, 30, 4);
      table.id = tableId;
      table.table = properties.name;
      this.ctx.lineWidth = 0.2;
      this.ctx.strokeStyle = 'gray';
      this.ctx.stroke(table);
      this.ctx.closePath();
      this.ctxTablesObject[tableId] = table;
      // console.log(app.ctxTablesObject);

      this.ctx.font = '0.8rem Barlow';
      this.ctx.fillStyle = '#494949';
      this.ctx.fillText(properties.name, properties.x + 20, properties.y + 20);

      // startpoint / endpoint
      this.ctx.beginPath();
      this.ctx.fillStyle = 'lightgray';
      this.ctx.arc(properties.x - 10, properties.y + 15, 2, 0, 6);
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.arc(properties.x + 180, properties.y + 15, 2, 0, 6);
      // ctx.stroke(); // cerchio senza colore di riempimento
      this.ctx.fill();
      this.ctx.closePath();
    }

  }

  drawLines() {
    // se non sono presenti tabelle non disegno la linea
    if (this.#tables.size === 0) return;
    const line = new Path2D();
    for (const [lineId, properties] of this.joinLines) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'darkorange';
      this.ctx.lineWidth = 3;
      line.moveTo(properties.pos.x, properties.pos.y);
      // ctxLine.moveTo(p0.x, p0.y);
      // ctxLine.bezierCurveTo(p1.x, 115, p2.x - 150, p2.y, p2.x, p2.y);
      line.bezierCurveTo(properties.cp1x, properties.cp1y, properties.cp2x, properties.cp2y, properties.x, properties.y);
      this.ctx.stroke(line);
    }
  }
}
