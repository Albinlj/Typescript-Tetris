"use strict";
class Vector2D {
    constructor(x, y) {
        this.y = x;
        this.x = y;
    }
    add(other) {
        this.y += other.y;
        this.x += other.x;
    }
    static add(a, b) {
        return new Vector2D(a.y + b.y, a.x + b.x);
    }
    static subtract(a, b) {
        return new Vector2D(a.y - b.y, a.x - b.x);
    }
    static equals(a, b) {
        return a.y == b.y && a.x == b.x;
    }
    static opposite(a) {
        return new Vector2D(a.x, a.y);
    }
    subtract(other) {
        this.y -= other.y;
        this.x -= other.x;
    }
    ToString() {
        return "Coordinate: [y: " + this.y + ", x: " + this.x + "]";
    }
}
