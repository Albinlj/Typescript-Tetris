"use strict";
class Block {
    constructor(_coords, _color) {
        this.coord = _coords;
        this.color = _color;
    }
    Move(moveCoord) {
        this.coord.add(moveCoord);
    }
    ToString() {
        return "Coordinate: [y: " + this.coord.y + ", x: " + this.coord.x + "]";
    }
}
