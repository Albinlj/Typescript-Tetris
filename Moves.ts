function AttemptMove(_coord: Coord) {
  if (
    activePiece!.blocks.every(aliveBlock =>
      IsValidCoord(Coord.add(aliveBlock.coord, _coord))
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
          new Coord(aliveBlock.coord.y + 1, aliveBlock.coord.x)
        )
    )
  ) {
    activePiece!.Move(new Coord(1, 0));
  }
  KillActivePiece();
  ClearFullLines();
  ResetTimer();
  ActivateNextPiece();
  DrawPage();
}

function AttemptRotate(wise: Rotation) {
  let worldCoords = activePiece!.GetWorldRotationCoords(wise);

  // for (let i = 0; i < 5; i++) {}
  if (worldCoords.every(coord => IsValidCoord(coord))) {
    // activePiece!.Rotate(wise);
    activePiece!.ChangeCoords(worldCoords);
  }
}
