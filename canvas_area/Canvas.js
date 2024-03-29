class DrawCanvas {
  #tables = new Map();
  #joinLines = new Map();
  #levels = new Map();

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
    // accessibili dall'esterno
    // Object che contiene la lista delle tabelle Path2d
    this.ctxTablesObject = {};
    this.ctxLevels = {};
    this.joinLineId = 1;
    // consente di spostarmi, durante il drag&drop anche oltre (-x, -y) le tables già presenti nel Canvas
    this.lastFromLineCoords = {};
    this.currentLevel;
  }

  set tables(value) {
    this.#tables.set(value.id, value.properties);
  }

  get tables() { return this.#tables; }

  set joinLines(value) {
    this.#joinLines.set(value.id, value);
    console.log(this.#joinLines);
  }

  get joinLines() { return this.#joinLines; }

  set levels(value) {
    // this.#levels.set(`level-${this.#levels.size}`, { x: value.x, y: value.y, x1: value.x1 });
    this.#levels.set(value.id, { id: value.id, x: value.x, y: value.y, width: value.width });
  }

  get levels() { return this.#levels; }

  drawLevels() {
    let colors = ['#D0B8A8', '#DFD3C3', '#B4CFB0', '#C7B198', '#E2C2B9'];
    for (const [key, value] of this.#levels) {
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      const level = new Path2D();
      level.id = `level-${key}`;
      level.levelId = key;
      level.rect(value.x, value.y, value.width, this.canvas.height);
      // this.ctx.fillStyle = 'lightgreen';
      // this.ctx.fillStyle = 'rgb(24, 44, 66)';
      // this.ctx.fillStyle = '#DFD3C3';
      this.ctx.fillStyle = colors[key];
      this.ctx.fill(level);
      this.ctx.closePath();
      this.ctxLevels[level.id] = level;
    }
  }

  drawTable() {
    // console.log(this.currentTable);
    // creo, oppure, ricreo tutte le table presenti nel canvas
    // console.log(tableId, value);
    this.ctx.beginPath();
    const table = new Path2D();
    table.roundRect(this.currentTable.x, this.currentTable.y, 170, 30, 4);
    this.ctx.fillStyle = "gainsboro";
    this.ctx.fill(table);
    // table.roundRect(value.x, value.y, 170, 30, 4);
    table.id = this.currentTable.key;
    table.table = this.currentTable.name;
    this.ctx.lineWidth = 0.2;
    this.ctx.strokeStyle = 'gray';
    this.ctx.stroke(table);
    this.ctx.closePath();
    this.ctxTablesObject[this.currentTable.key] = table;
    // console.log(app.ctxTablesObject);

    this.ctx.font = '0.8rem Barlow';
    this.ctx.fillStyle = '#494949';
    this.ctx.fillText(this.currentTable.name, this.currentTable.x + 20, this.currentTable.y + 20);

    // startpoint / endpoint
    this.ctx.beginPath();
    this.ctx.fillStyle = 'lightgray';
    this.ctx.arc(this.currentTable.x - 10, this.currentTable.y + 15, 2, 0, 6);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.arc(this.currentTable.x + 180, this.currentTable.y + 15, 2, 0, 6);
    // ctx.stroke(); // cerchio senza colore di riempimento
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawTables() {
    // creo, oppure, ricreo tutte le table presenti nel canvas
    for (const [tableId, properties] of this.#tables) {
      this.currentTable = properties;
      this.drawTable();
    }
  }

  drawLines() {
    // se non sono presenti tabelle non disegno la linea
    if (this.#tables.size === 0) return;
    const line = new Path2D();
    for (const [key, value] of this.joinLines) {
      // this.ctx.beginPath();
      this.ctx.strokeStyle = 'darkorange';
      this.ctx.lineWidth = 3;
      // tabella da cui parte la line
      const from = this.tables.get(value.tableFrom).from;
      let to;
      // se la tableTo non è definita, sto effettuando un drag&drop, quindi non esiste ancora in this.tables, per cui ne recupero e.offsetX/e.offsetY.
      if (typeof value.tableTo === 'object') {
        to = { x: value.tableTo.x, y: value.tableTo.y };
      } else {
        // la tabella è già definita e presente in this.tables, ne recupero le coordinate come fatto qui con tableFrom
        to = this.tables.get(value.tableTo).to;
      }
      line.moveTo(from.x, from.y);
      const p1 = { x: from.x + 40, y: from.y };
      const p2 = { x: to.x - 40, y: to.y };
      // ctxLine.moveTo(p0.x, p0.y);
      // ctxLine.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p2.x, p2.y);
      line.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, to.x, to.y);
      this.ctx.stroke(line);
    }
  }

  redraw() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawLevels();
    this.drawTables();
    this.drawLines();
    this.ctx.restore();
  }
}
