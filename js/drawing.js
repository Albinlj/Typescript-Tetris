"use strict";
function CreateButtonGrid(height, width) {
    //Main GameArea
    for (let i = 0; i < height; i++) {
        let row = document.createElement("div");
        row.classList.add("cellrow");
        for (let j = 0; j < width; j++) {
            let cell = document.createElement("button");
            cell.classList.add("cell");
            row.appendChild(cell);
            cells.push(cell);
        }
        document.getElementById("gameboard").appendChild(row);
    }
    //Nextpiece Area
    for (let i = 0; i < 2; i++) {
        let row = document.createElement("div");
        row.classList.add("cellrow");
        for (let j = 0; j < 4; j++) {
            let cell = document.createElement("button");
            cell.classList.add("cell");
            row.appendChild(cell);
            nextPieceCells.push(cell);
        }
        document.getElementById("nextpiece").appendChild(row);
    }
}
function DrawPage() {
    //GameBoard
    cells.forEach(cell => {
        for (let i = 0; i < 8; i++) {
            cell.classList.remove("color" + i);
            cell.classList.remove("front");
            cell.classList.add("back");
        }
    });
    let allBlocks = deadBlocks;
    if (activePiece != null) {
        allBlocks = activePiece.blocks.concat(deadBlocks);
    }
    allBlocks.forEach(block => {
        let cell = cells[block.coord.y * width + block.coord.x];
        cell.classList.remove("back");
        cell.classList.add("color" + block.color);
        cell.classList.add("front");
    });
}
function DrawNextPiece() {
    nextPieceCells.forEach(cell => {
        for (let i = 0; i < 8; i++) {
            cell.classList.remove("color" + i);
            cell.classList.remove("front");
            cell.classList.add("hidden");
        }
    });
    nextPiece.blocks.forEach(block => {
        let cell = nextPieceCells[(block.coord.y - nextPiece.coord.y) * 4 +
            (block.coord.x - nextPiece.coord.x)];
        cell.classList.remove("hidden");
        cell.classList.add("color" + block.color);
        cell.classList.add("front");
    });
}
