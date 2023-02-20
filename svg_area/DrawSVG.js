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
    this.arrayLevels = [];
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
    g.dataset.tableJoin = this.currentTable.join;
    g.setAttribute('x', this.currentTable.x);
    g.setAttribute('y', this.currentTable.y);
    // posizione start ('from') della linea di join
    g.dataset.lineFromX = this.currentTable.line.from.x;
    g.dataset.lineFromY = this.currentTable.line.from.y;
    g.dataset.x = this.currentTable.x;
    g.dataset.y = this.currentTable.y;
    g.dataset.levelId = this.currentTable.levelId;
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
    if (Object.keys(this.currentLine).length === 0) return;
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

  joinTablePositioning() {
    // recupero tutte le tabelle con data-joins > 1 partendo dal livello più alto (l'ultimo)
    // ciclo dal penultimo livello fino a 0 per riposizionare tutti gli elementi che hanno più di 1 join con altre tabelle
    this.arrayLevels.forEach(levelId => {
      // il primo ciclo recupera le tabelle del penultimo level (le tabelle dell'ultimo level non hanno altre tabelle collegate ad esse)
      this.svg.querySelectorAll(`g.table[data-level-id='${levelId}']:not([data-joins='1'], [data-joins='0'])`).forEach(table => {
        let y = 0;
        // verifico la posizione y delle tabelle legate in join con quella in ciclo
        for (let properties of this.tables.values()) {
          if (properties.join === table.id) y += properties.y;
        }
        // la tabella in ciclo verrà riposizionata in base a y calcolato.
        // Se sono presenti due tabelle in join con 'table' (in ciclo) le posizioni y di queste tabelle vengono sommate (nel for) e 
        // ...poi divise per il numero di tabelle join, in questo modo la tabella in ciclo viene posizionata al centro 
        this.tables.get(table.id).y = (y / table.dataset.joins);
        this.tables.get(table.id).line.from.y = (y / table.dataset.joins) + 15;
        this.tables.get(table.id).line.to.y = (y / table.dataset.joins) + 15;
        this.currentTable = this.tables.get(table.id);
        this.autoPosition();
      });
    });
    this.autoPositionLine();
  }

  autoPosition() {
    const tableRef = this.svg.querySelector(`#${this.currentTable.key}`);
    const rect = tableRef.querySelector('rect');
    const text = tableRef.querySelector('text');
    tableRef.setAttribute('y', this.currentTable.y);
    tableRef.dataset.y = this.currentTable.y;
    rect.setAttribute('y', this.currentTable.y);
    text.setAttribute('y', this.currentTable.y + 16);
  }

  autoPositionLine() {
    for (const [key, properties] of this.joinLines) {
      this.currentLine = properties;
      this.drawLine();
    }
  }

}
