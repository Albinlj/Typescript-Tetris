"use strict";
class Coord {
    constructor(x, y) {
        this.y = x;
        this.x = y;
    }
    add(other) {
        this.y += other.y;
        this.x += other.x;
    }
    static add(a, b) {
        return new Coord(a.y + b.y, a.x + b.x);
    }
    static subtract(a, b) {
        return new Coord(a.y - b.y, a.x - b.x);
    }
    static equals(a, b) {
        return a.y == b.y && a.x == b.x;
    }
    subtract(other) {
        this.y -= other.y;
        this.x -= other.x;
    }
    ToString() {
        return "Coordinate: [y: " + this.y + ", x: " + this.x + "]";
    }
}
