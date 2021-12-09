(() => {
  console.log('loading...')
  const X = 0, Y = 1;

  class Board {
    private cells: Map<string, Cell>
    private elm: HTMLElement

    private _height: number;
    private _width: number;

    constructor(height: number, width: number) {
      this._height = height;
      this._width = width;

      this.cells = new Map();
      this.elm = document.getElementById('board')!;

      if (!this.elm) {
        throw Error("No element with id 'board' found.")
      }

      this.elm.style.height = `${height.toString()}px`;
      this.elm.style.width = `${width.toString()}px`;

      // Create cells.
      const maxX = this._width / 2
      const maxY = this._height / 2
      const minX = -1 * maxX
      const minY = -1 * maxY

      for (let x = minX; x < maxX; x++) {
        for (let y = minY; y < maxY; y++) {
          this.placeCell(new Cell(x, y))
        }
      }
    }

    get height(): number {
      return this._height;
    }

    get width(): number {
      return this._width;
    }

    evaluate = () => {
      this.cells.forEach((cell, key) => {
        const liveNeighbors = cell.neighbors.reduce((acc, neighbor) => {
          if (this.cells.get(neighbor)?.alive) {
            return acc + 1;
          }
          return acc + 0;
        }, 0);

        if (liveNeighbors > 0) {
          console.log(`cell at ${key} has ${liveNeighbors} live neighbors.`)
        }
      })
    }

    placeCell = (cell: Cell, x?: number, y?: number) => {
      const halfHeight = (this.elm.clientHeight / 2) + this.elm.offsetTop
      const halfWidth = (this.elm.clientWidth / 2) + this.elm.offsetLeft

      const origin = [ halfWidth, halfHeight ];

      if (x) cell.x = x;
      else x = cell.x;

      if (y) cell.y = y
      else y = cell.y

      // Check x,y within board boundaries
      if (x > halfWidth || y > halfWidth) {
        console.warn(`cannot place cell at (${x}, ${y}); out of bounds.`);
        return;
      }

      cell.elm.style.position = 'absolute'
      cell.elm.style.left = `${origin[X] - cell.x}px`;
      cell.elm.style.top = `${origin[Y] - cell.y}px`;

      if (cell.alive) {
        this.elm.appendChild(cell.elm)
      }

      this.cells.set(cell.pos, cell);
    }
  }

  class Cell {
    public elm: HTMLElement

    private _alive: boolean = false;
    private _neighbors: string[];
    private _x: number
    private _y: number

    constructor(x?: number, y?: number) {
      this._x = x || 0
      this._y = y || 0

      this.elm = document.createElement('div');
      this.elm.classList.add('cell')

      this._neighbors = this.generateNeighbors();
    }

    public get alive(): boolean {
      return this._alive;
    }

    public get neighbors(): string[] {
      return this._neighbors;
    }

    public get pos(): string {
      return [this._x, this._y].join(',')
    }

    public get x() {
      return this._x;
    }

    public get y() {
      return this._y;
    }

    public setAlive() {
      this._alive = true;
    }

    public setDead() {
      this._alive = false;
    }

    public set x(_x: number) {
      this._x = _x;
      this._neighbors = this.generateNeighbors()
    }

    public set y(_y: number) {
      this._y = _y;
      this._neighbors = this.generateNeighbors()
    }

    private generateNeighbors() {
      return [
        // Neighbors above.
        [this.x - 1, this.y + 1].join(','), [ this.x, this.y + 1].join(','), [ this.x + 1, this.y + 1].join(','),
        // Lateral neighbors.
        [this.x - 1, this.y].join(','), [ this.x + 1, this.y].join(','),
        // Neighbors below.
        [this.x - 1, this.y - 1].join(','), [ this.x, this.y - 1].join(','), [ this.x + 1, this.y - 1].join(','),
      ];
    }
  }

  const board = new Board(150, 150);

  const cell1 = new Cell(70, 70)
  cell1.setAlive();
  board.placeCell(cell1);
  // const cell2 = new Cell(69, 71)
  // cell2.setAlive();
  // board.placeCell(cell2);
  board.evaluate()
  console.log('done.')
})()

