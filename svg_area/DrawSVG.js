class DrawSVG {
  #tables = new Map();
  #joinLines = new Map();
  #levels = new Map();
  #currentLineRef; // ref

  constructor(element) {
    this.svg = document.getElementById(element);
    // consente di spostarmi, durante il drag&drop anche oltre (-x, -y) le tables già presenti nel Canvas
    this.lastFromLineCoords = {};
    this.currentLevel;
    // this.currentLineRef; // ref
    this.currentTable = {}, this.currentLine = {};
  }

  set tables(value) {
    this.#tables.set(value.id, value.properties);
  }

  get tables() { return this.#tables; }

  set currentLineRef(value) {
    this.#currentLineRef = this.svg.querySelector(`#${value}`);
  }

  get currentLineRef() { return this.#currentLineRef; }

  set joinLines(value) {
    this.#joinLines.set(value.id, value.properties);
  }

  get joinLines() { return this.#joinLines; }

  set levels(value) {
    // this.#levels.set(`level-${this.#levels.size}`, { x: value.x, y: value.y, x1: value.x1 });
    this.#levels.set(value.id, { id: value.id, x: value.x, y: value.y, width: value.width });
  }

  get levels() { return this.#levels; }

  drawTable() {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = this.currentTable.key;
    g.dataset.id = `data-${this.currentTable.id}`;
    g.classList.add('table');
    g.dataset.table = this.currentTable.table;
    g.dataset.schema = this.currentTable.schema;
    g.dataset.joins = this.currentTable.joins;
    g.setAttribute('x', this.currentTable.x);
    g.setAttribute('y', this.currentTable.y);
    g.dataset.x = this.currentTable.x;
    g.dataset.y = this.currentTable.y;
    Draw.svg.appendChild(g);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', this.currentTable.x);
    rect.setAttribute('y', this.currentTable.y);
    g.appendChild(rect);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.innerHTML = this.currentTable.table;
    text.setAttribute('x', this.currentTable.x + 24);
    text.setAttribute('y', this.currentTable.y + 16);
    // text.setAttribute('fill', '#494949');
    // text.setAttribute('text-anchor', 'start');
    text.setAttribute('dominant-baseline', 'middle');
    g.appendChild(text);
  }

  drawLine() {
    // console.log(this.currentLine.from, this.currentLine.to);
    const coordsFrom = {
      x: this.tables.get(this.currentLine.from).line.from.x,
      y: this.tables.get(this.currentLine.from).line.from.y
    };
    let coordsTo;
    if (typeof this.currentLine.to === 'object') {
      // coordinate e.offsetX, e.offsetY. In questo caso provengo da dragOver.
      coordsTo = { x: this.currentLine.to.x, y: this.currentLine.to.y };
    } else {
      // tabella To
      coordsTo = {
        x: this.tables.get(this.currentLine.to).line.to.x,
        y: this.tables.get(this.currentLine.to).line.to.y
      };
    }
    this.line = {
      x1: coordsFrom.x, // start point
      y1: coordsFrom.y,
      p1x: coordsFrom.x + 40, // control point 1
      p1y: coordsFrom.y,
      p2x: coordsTo.x - 40, // control point 2
      p2y: coordsTo.y,
      x2: coordsTo.x, // end point
      y2: coordsTo.y
    };
    const d = `M${this.line.x1},${this.line.y1} C${this.line.p1x},${this.line.p1y} ${this.line.p2x},${this.line.p2y} ${this.line.x2},${this.line.y2}`;
    this.currentLineRef = this.currentLine.key;
    this.currentLineRef.setAttribute('d', d);
  }

  // riposiziona gli elementi
  redraw() {
    console.info('redraw');
    for (const [key, table] of this.tables) {
      const tableRef = this.svg.querySelector(`#${key}`);
      const rect = this.svg.querySelector(`#${key} rect`);
      const text = this.svg.querySelector(`#${key} text`);
      tableRef.setAttribute('y', table.y);
      rect.setAttribute('y', table.y);
      text.setAttribute('y', table.y + 16);
      // ri-posizionamento line
      if (this.joinLines.has(`line-${table.id}`)) {
        this.currentLine = this.joinLines.get(`line-${table.id}`);
        this.drawLine();
      }
    }
  }
}
