class Block {
  coord: Vector2D;
  color: number;

  constructor(_coords: Vector2D, _color: number) {
    this.coord = _coords;
    this.color = _color;
  }

  Move(moveCoord: Vector2D) {
    this.coord.add(moveCoord);
  }

}
