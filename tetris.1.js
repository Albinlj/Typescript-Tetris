"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var cells = new Array();
var nextPieceCells = new Array();
var deadBlocks = new Array();
var activePiece;
var nextPiece;
var score = 0;
var level = 1;
var linesClearedThisLevel = 0;
var linesCleared = 0;
var gameOver = false;
let width = 10;
let height = 20;
var timer = null;
const speedRatio = 10;
var gameOverText = document.getElementsByClassName("strut")[0];
CreateButtonGrid(height, width);
RestartGame();
window.addEventListener("keydown", function(event) {
  if (!gameOver) {
    switch (event.keyCode) {
      case 37: //Left
        AttemptMove([0, -1]);
        break;
      case 39: //Right
        AttemptMove([0, 1]);
        break;
      case 40: // Down
        AttemptMove([1, 0]);
        break;
      case 38: //Up
      case 88: //X
        AttemptRotate(Rotation.Clockwise);
        DrawPage();
        break;
        break;
      case 17: //LCtrl
      case 90: //Z
        AttemptRotate(Rotation.Counterclockwise);
        DrawPage();
        break;
      case 67: //C
        break;
      case 68: //D
        AttemptMove([1, 0]);
        break;
      case 83: //S
        HardDrop();
        break;
      default:
        break;
    }
  } else {
    switch (event.keyCode) {
      case 82: //R
        RestartGame();
        break;
      default:
        break;
    }
  }
  console.log(event.keyCode);
});
function RestartGame() {
  gameOverText.classList.add("hidden");
  gameOver = false;
  activePiece = null;
  nextPiece = null;
  deadBlocks = [];
  ActivateNextPiece();
  score = 0;
  linesClearedThisLevel = 0;
  linesCleared = 0;
  level = 1;
  ResetTimer();
  Score(0);
  DrawPage();
}
function AttemptRotate(wise) {
  let worldCoords = activePiece.GetWorldRotationCoords(wise);
  if (worldCoords.every(coord => IsValidCoord(coord))) {
    activePiece.Rotate(wise);
  }
}
function GameOver() {
  return __awaiter(this, void 0, void 0, function*() {
    gameOver = true;
    clearInterval(timer);
    timer = null;
    activePiece = null;
    for (i = height - 1; i >= 0; i--) {
      let colorIndex = Math.floor(Math.random() * 8);
      RemoveLine(i);
      for (j = 0; j < width; j++) {
        let newBlock = new block([i, j], colorIndex);
        deadBlocks.push(newBlock);
      }
      DrawPage();
      yield sleep(10);
    }
    gameOverText.classList.remove("hidden");
    for (i = 0; i < height; i++) {
      RemoveLine(i);
      DrawPage();
      yield sleep(10);
    }
  });
}
function RemoveLine(line) {
  deadBlocks = deadBlocks.filter(deadBlock => deadBlock.coords[0] != line);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function ResetTimer() {
  const speeds = [
    0.01667,
    0.021017,
    0.026977,
    0.035256,
    0.04693,
    0.06361,
    0.0879,
    0.1236,
    0.1775,
    0.2598,
    0.388,
    0.59,
    0.92,
    1.46,
    2.36
  ];
  if (timer != null) {
    this.clearInterval(timer);
  }
  let thisIndex = 15 - Math.max(level, 15);
  let ms = Math.floor(speedRatio / speeds[thisIndex]);
  timer = setInterval(GameTick, ms);
}
function AttemptMove(_coord) {
  if (
    activePiece.blocks.every(aliveBlock =>
      IsValidCoord([
        aliveBlock.coords[0] + _coord[0],
        aliveBlock.coords[1] + _coord[1]
      ])
    )
  ) {
    activePiece.Move(_coord);
    DrawPage();
  }
}
function HardDrop() {
  while (
    activePiece.blocks.every(
      aliveBlock =>
        aliveBlock.coords[0] < height - 1 &&
        !CoordinateHasDead([aliveBlock.coords[0] + 1, aliveBlock.coords[1]])
    )
  ) {
    activePiece.Move([1, 0]);
  }
  KillActivePiece();
  ClearFullLines();
  ResetTimer();
  ActivateNextPiece();
  DrawPage();
}
function Score(lineCount) {
  let scoreIncrement;
  switch (lineCount) {
    case 1:
      scoreIncrement = 100;
      break;
    case 2:
      scoreIncrement = 300;
      break;
    case 3:
      scoreIncrement = 500;
      break;
    case 4:
      scoreIncrement = 800;
      break;
    default:
      scoreIncrement = 0;
      break;
  }
  scoreIncrement *= level;
  score += scoreIncrement;
  linesClearedThisLevel += lineCount;
  if (level < 20 && linesClearedThisLevel >= 10) {
    linesClearedThisLevel -= 10;
    level++;
  }
  document.getElementById("score").innerHTML = "SCORE: " + score;
  document.getElementById("level").innerHTML = "LEVEL: " + level;
  document.getElementById("lines").innerHTML = "LINES: " + linesCleared;
}
function ClearFullLines() {
  let fullLines = [];
  let isFullLine;
  for (let i = 0; i < height; i++) {
    isFullLine = true;
    for (let j = 0; j < width; j++) {
      if (
        !deadBlocks.some(deadBlock => CoordsAreSame(deadBlock.coords, [i, j]))
      ) {
        isFullLine = false;
      }
    }
    if (isFullLine) {
      fullLines.push(i);
    }
  }
  for (let i = 0; i < fullLines.length; i++) {
    RemoveLine(fullLines[i]);
    DrawPage();
    deadBlocks
      .filter(block => block.coords[0] < fullLines[i])
      .forEach(deadBlock => deadBlock.Move([1, 0]));
  }
  linesCleared += fullLines.length;
  Score(fullLines.length);
}
function CoordinateHasDead(_coord) {
  return deadBlocks.some(deadBlock => CoordsAreSame(deadBlock.coords, _coord));
}
function IsValidCoord(_coord) {
  return (
    !CoordinateHasDead(_coord) &&
    _coord[0] > -1 &&
    _coord[0] < height &&
    _coord[1] > -1 &&
    _coord[1] < width
  );
}
function CoordsAreSame(a, b) {
  return a[0] == b[0] && a[1] == b[1];
}
function GameTick() {
  //Check landings
  let islanding = false;
  activePiece.blocks.forEach(activeBlock => {
    //Check for landing on bottom
    if (activeBlock.coords[0] == height - 1) {
      islanding = true;
    }
    //Check if landing on block
    if (CoordinateHasDead([activeBlock.coords[0] + 1, activeBlock.coords[1]])) {
      islanding = true;
    }
  });
  if (islanding) {
    KillActivePiece();
    ClearFullLines();
    ActivateNextPiece();
  } else {
    activePiece.Move([1, 0]);
  }
  DrawPage();
}
function KillActivePiece() {
  activePiece.blocks.forEach(aliveBlock => {
    deadBlocks.push(aliveBlock);
  });
  activePiece = null;
}
function ActivateNextPiece() {
  if (nextPiece == null) {
    SpawnRandomNextPiece();
  }
  activePiece = nextPiece;
  for (let i = 0; i < deadBlocks.length; i++) {
    const deadBlock = deadBlocks[i];
    for (let j = 0; j < activePiece.blocks.length; j++) {
      const activeBlock = activePiece.blocks[j];
      if (CoordsAreSame(deadBlock.coords, activeBlock.coords)) {
        GameOver();
        break;
      }
    }
    if (activePiece == null) {
      break;
    }
  }
  SpawnRandomNextPiece();
}
function SpawnRandomNextPiece() {
  let type = Math.floor(Math.random() * 7);
  let colorIndex = Math.floor(Math.random() * 8);
  nextPiece = new piece([3, 4], type, colorIndex);
  DrawNextPiece();
}
