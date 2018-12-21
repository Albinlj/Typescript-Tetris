class Coord {
  y: number;
  x: number;
  constructor(x: number, y: number) {
    this.y = x;
    this.x = y;
  }

  add(other: Coord) {
    this.y += other.y;
    this.x += other.x;
  }

  static add(a: Coord, b: Coord): Coord {
    return new Coord(a.y + b.y, a.x + b.x);
  }

  static subtract(a: Coord, b: Coord): Coord {
    return new Coord(a.y - b.y, a.x - b.x);
  }

  static equals(a: Coord, b: Coord): boolean {
    return a.y == b.y && a.x == b.x;
  }

  subtract(other: Coord) {
    this.y -= other.y;
    this.x -= other.x;
  }

  ToString(): string {
    return "Coordinate: [y: " + this.y + ", x: " + this.x + "]";
  }
}
