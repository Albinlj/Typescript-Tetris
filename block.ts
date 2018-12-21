class Block {
  coord: Coord;
  color: number;

  constructor(_coords: Coord, _color: number) {
    this.coord = _coords;
    this.color = _color;
  }

  Move(moveCoord: Coord) {
    this.coord.add(moveCoord);
  }

  ToString(): string {
    return "Coordinate: [y: " + this.coord.y + ", x: " + this.coord.x + "]";
  }
}
