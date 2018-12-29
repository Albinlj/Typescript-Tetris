var cells = new Array();
var nextPieceCells = new Array();

var deadBlocks: Block[] = new Array();
var activePiece: Piece | null;
var nextPiece: Piece | null;
var score = 0;
var level = 1;
var linesClearedThisLevel = 0;
var linesCleared = 0;
var gameOver = false;

let width = 10;
let height = 20;

var timer: any = null;
const speedRatio = 10;
var gameOverText = document.getElementsByClassName("strut")[0];

CreateButtonGrid(height, width);
RestartGame();

window.addEventListener("keydown", function(event) {
  if (!gameOver) {
    switch (event.keyCode) {
      case 37: //Left
        AttemptMove(new Vector2D(0, -1));
        break;
      case 39: //Right
        AttemptMove(new Vector2D(0, 1));
        break;
      case 40: // Down
        AttemptMove(new Vector2D(1, 0));
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
        AttemptMove(new Vector2D(1, 0));
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

async function GameOver() {
  gameOver = true;
  clearInterval(timer);
  timer = null;
  activePiece = null;

  for (let i = height - 1; i >= 0; i--) {
    let colorIndex = Math.floor(Math.random() * 8);
    RemoveLine(i);

    for (let j = 0; j < width; j++) {
      let newBlock = new Block(new Vector2D(i, j), colorIndex);
      deadBlocks.push(newBlock);
    }
    DrawPage();
    await sleep(10);
  }

  gameOverText.classList.remove("hidden");

  for (let i = 0; i < height; i++) {
    RemoveLine(i);
    DrawPage();
    await sleep(10);
  }
}

function RemoveLine(line: number) {
  deadBlocks = deadBlocks.filter(deadBlock => deadBlock.coord.y != line);
}

function sleep(ms: number) {
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
    clearInterval(timer);
  }

  let thisIndex = 15 - Math.max(level, 15);
  let ms = Math.floor(speedRatio / speeds[thisIndex]);
  timer = setInterval(GameTick, ms);
}

function Score(lineCount: number) {
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

  document.getElementById("score")!.innerHTML = "SCORE: " + score;
  document.getElementById("level")!.innerHTML = "LEVEL: " + level;
  document.getElementById("lines")!.innerHTML = "LINES: " + linesCleared;
}

function ClearFullLines() {
  let fullLines: number[] = [];

  let isFullLine;
  for (let i = 0; i < height; i++) {
    isFullLine = true;
    for (let j = 0; j < width; j++) {
      if (
        !deadBlocks.some(deadBlock =>
          Vector2D.equals(deadBlock.coord, new Vector2D(i, j))
        )
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
    // DrawPage();
    deadBlocks
      .filter(block => block.coord.y < fullLines[i])
      .forEach(deadBlock => deadBlock.Move(new Vector2D(1, 0)));
  }

  linesCleared += fullLines.length;
  Score(fullLines.length);
}

function CoordinateHasDead(_coord: Vector2D) {
  return deadBlocks.some(deadBlock => Vector2D.equals(deadBlock.coord, _coord));
}

function IsValidCoord(_coord: Vector2D): boolean {
  return (
    !CoordinateHasDead(_coord) &&
    _coord.y > -1 &&
    _coord.y < height &&
    _coord.x > -1 &&
    _coord.x < width
  );
}

function GameTick() {
  //Check landings
  let islanding = false;
  activePiece!.blocks.forEach(activeBlock => {
    //Check for landing on bottom
    if (
      activeBlock.coord.y == height - 1 ||
      CoordinateHasDead(Vector2D.add(activeBlock.coord, new Vector2D(1, 0)))
    ) {
      islanding = true;
    }
  });

  if (islanding) {
    KillActivePiece();
    ClearFullLines();
    ActivateNextPiece();
  } else {
    activePiece!.Move(new Vector2D(1, 0));
  }
  DrawPage();
}

function KillActivePiece() {
  activePiece!.blocks.forEach(aliveBlock => {
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
    for (let j = 0; j < activePiece!.blocks.length; j++) {
      const activeBlock = activePiece!.blocks[j];
      if (Vector2D.equals(deadBlock.coord, activeBlock.coord)) {
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
  nextPiece = new Piece(new Vector2D(3, 4), type, colorIndex);
  DrawNextPiece();
}
