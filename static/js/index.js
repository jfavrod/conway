"use strict";
(() => {
    console.log('loading...');
    const X = 0, Y = 1;
    class Board {
        constructor(height, width) {
            this.cells = [];
            this.evaluate = () => {
                const populated = new Set(this.cells.map((cell) => cell.pos));
                this.cells.forEach((cell) => {
                    const count = Array.from(populated).reduce((acc, cur) => {
                        console.log('checking', cur, cell.neighbors);
                        if (cell.neighbors.includes(cur)) {
                            return acc + 1;
                        }
                        return acc + 0;
                    }, 0);
                    console.log(`cell ${cell.pos} has ${count} neighbors`);
                });
            };
            this.placeCell = (cell, x, y) => {
                const origin = [this.elm.offsetWidth / 2, (this.elm.offsetHeight / 2)];
                if (x)
                    cell.x = x;
                else
                    x = cell.x;
                if (y)
                    cell.y = y;
                else
                    y = cell.y;
                // Check x,y within board boundaries
                cell.elm.style.position = 'absolute';
                cell.elm.style.left = `${origin[Y] + cell.x}px`;
                cell.elm.style.top = `${origin[X] - cell.y}px`;
                this.elm.appendChild(cell.elm);
                this.cells.push(cell);
            };
            this.cells = [];
            this.elm = document.getElementById('board');
            if (!this.elm) {
                throw Error("No element with id 'board' found.");
            }
            this.elm.style.height = `${height.toString()}px`;
            this.elm.style.width = `${width.toString()}px`;
        }
    }
    class Cell {
        constructor(x, y) {
            this._x = x || 0;
            this._y = y || 0;
            this.elm = document.createElement('div');
            this.elm.classList.add('cell');
            this._neighbors = this.generateNeighbors();
        }
        get neighbors() {
            return this._neighbors;
        }
        get pos() {
            return [this._x, this._y].join(',');
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        set x(_x) {
            this._x = _x;
            this._neighbors = this.generateNeighbors();
        }
        set y(_y) {
            this._y = _y;
            this._neighbors = this.generateNeighbors();
        }
        generateNeighbors() {
            return [
                // Neighbors above.
                [this.x - 1, this.y + 1].join(','), [this.x, this.y + 1].join(','), [this.x + 1, this.y + 1].join(','),
                // Lateral neighbors.
                [this.x - 1, this.y].join(','), [this.x + 1, this.y].join(','),
                // Neighbors below.
                [this.x - 1, this.y - 1].join(','), [this.x, this.y - 1].join(','), [this.x + 1, this.y - 1].join(','),
            ];
        }
    }
    const board = new Board(600, 600);
    board.placeCell(new Cell());
    board.placeCell(new Cell(0, 1));
    board.placeCell(new Cell(10, 10));
    board.placeCell(new Cell(), 25, 25);
    board.evaluate();
    console.log('done.');
})();
