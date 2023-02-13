class DrawSVG {
  #tables = new Map();
  #joinLines = new Map();
  #levels = new Map();

  constructor(element) {
    this.svg = document.getElementById(element);
    console.log(this.svg);
    this.ctxLevels = {};
    this.joinLineId = 1;
    // consente di spostarmi, durante il drag&drop anche oltre (-x, -y) le tables già presenti nel Canvas
    this.lastFromLineCoords = {};
    this.currentLevel;
    this.currentLine;
    this.currentTable;
  }

  set tables(value) {
    this.#tables.set(value.id, value.properties);
    console.log(this.tables);
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

  // ridisegna dopo il posizionamento automatico
  redraw() {
    // this.drawLevels();
    this.drawTables();
    this.drawLines();
  }
}
