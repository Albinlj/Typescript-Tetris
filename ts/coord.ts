class Vector2D {
  y: number;
  x: number;
  constructor(x: number, y: number) {
    this.y = x;
    this.x = y;
  }

  add(other: Vector2D) {
    this.y += other.y;
    this.x += other.x;
  }

  static add(a: Vector2D, b: Vector2D): Vector2D {
    return new Vector2D(a.y + b.y, a.x + b.x);
  }

  static subtract(a: Vector2D, b: Vector2D): Vector2D {
    return new Vector2D(a.y - b.y, a.x - b.x);
  }

  static equals(a: Vector2D, b: Vector2D): boolean {
    return a.y == b.y && a.x == b.x;
  }

  static opposite(a: Vector2D): Vector2D {
    return new Vector2D(a.x, a.y);
  }

  subtract(other: Vector2D) {
    this.y -= other.y;
    this.x -= other.x;
  }

  ToString(): string {
    return "Coordinate: [y: " + this.y + ", x: " + this.x + "]";
  }
}
