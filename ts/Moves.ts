function AttemptMove(_coord: Vector2D) {
  if (
    activePiece!.blocks.every(aliveBlock =>
      IsValidCoord(Vector2D.add(aliveBlock.coord, _coord))
    )
  ) {
    activePiece!.Move(_coord);
    DrawPage();
  }
}
function HardDrop() {
  while (
    activePiece!.blocks.every(
      aliveBlock =>
        aliveBlock.coord.y < height - 1 &&
        !CoordinateHasDead(
          new Vector2D(aliveBlock.coord.y + 1, aliveBlock.coord.x)
        )
    )
  ) {
    activePiece!.Move(new Vector2D(1, 0));
  }
  KillActivePiece();
  ClearFullLines();
  ResetTimer();
  ActivateNextPiece();
  DrawPage();
}

function AttemptRotate(wise: Rotation) {
  //This algorithm implements "Wall Kicks"
  //http://tetris.wikia.com/wiki/SRS

  let worldCoords = activePiece!.GetWorldRotationCoords(wise);
  let wallKickMoves: number[][][] =
    activePiece!.type == Shape.I
      ? [
          [[0, 0], [0, -2], [0, 1], [-1, -2], [2, 1]],
          [[0, 0], [0, -1], [0, 2], [2, -1], [-1, 2]],
          [[0, 0], [0, 2], [0, -1], [1, 2], [-2, -1]],
          [[0, 0], [0, 1], [0, -2], [-2, 1], [1, -2]]
        ]
      : [
          [[0, 0], [0, -1], [1, -1], [-2, 0], [-2, -1]],
          [[0, 0], [0, 1], [-1, 1], [2, 0], [2, 1]],
          [[0, 0], [0, 1], [1, 1], [-2, 0], [-2, 1]],
          [[0, 0], [0, -1], [-1, -1], [2, 0], [2, -1]]
        ];

  for (let i = 0; i < 5; i++) {
    let firstindex = activePiece!.rotatestate;
    if (wise == Rotation.Counterclockwise) {
      firstindex = (firstindex + 3) % 4;
    }
    let addCoord: number[] = wallKickMoves[firstindex][i];

    let fullCoord = new Vector2D(addCoord[0], addCoord[1]);
    if (wise == Rotation.Counterclockwise) {
      fullCoord = Vector2D.opposite(fullCoord);
    }

    if (worldCoords.every(coord => IsValidCoord(Vector2D.add(coord, fullCoord)))) {
      activePiece!.ChangeCoords(worldCoords);
      activePiece!.Move(fullCoord);

      let increment = wise == Rotation.Clockwise ? 1 : -1;
      activePiece!.rotatestate += increment + 4;
      activePiece!.rotatestate %= 4;
      return;
    }
  }
}
