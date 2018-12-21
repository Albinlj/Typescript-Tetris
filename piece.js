"use strict";
class Piece {
    constructor(_coord, _type, _color) {
        this.rotatestate = 0;
        this.coord = _coord;
        this.color = _color;
        this.type = _type;
        //Set local coords
        let localBlockCoords = [];
        this.size = 3;
        switch (_type) {
            case Shape.I:
                localBlockCoords = [[1, 0], [1, 1], [1, 2], [1, 3]];
                this.size = 4;
                break;
            case Shape.J:
                localBlockCoords = [[0, 0], [1, 0], [1, 1], [1, 2]];
                break;
            case Shape.L:
                localBlockCoords = [[0, 2], [1, 0], [1, 1], [1, 2]];
                break;
            case Shape.O:
                localBlockCoords = [[0, 0], [0, 1], [1, 0], [1, 1]];
                this.size = 2;
                break;
            case Shape.S:
                localBlockCoords = [[1, 0], [1, 1], [0, 1], [0, 2]];
                break;
            case Shape.T:
                localBlockCoords = [[1, 0], [1, 1], [0, 1], [1, 2]];
                break;
            case Shape.Z:
                localBlockCoords = [[0, 0], [1, 1], [0, 1], [1, 2]];
                break;
            default:
                break;
        }
        //Remap the local coords
        let globalBlockCoords = localBlockCoords.map(local => Coord.add(new Coord(local[0], local[1]), _coord));
        this.blocks = [];
        globalBlockCoords.forEach(coord => {
            this.blocks.push(new Block(coord, this.color));
        });
    }
    GetBlocksLocalCoords() {
        return this.blocks.map(block => Coord.subtract(block.coord, this.coord));
    }
    GetLocalRotationCoords(wise) {
        if (wise == Rotation.Clockwise) {
            return this.GetBlocksLocalCoords().map(local => new Coord(local.x, this.size - local.y - 1));
        }
        else {
            return this.GetBlocksLocalCoords().map(local => new Coord(this.size - local.x - 1, local.y));
        }
    }
    GetWorldRotationCoords(wise) {
        return this.GetLocalRotationCoords(wise).map(local => Coord.add(local, this.coord));
    }
    Rotate(wise) {
        this.ChangeCoords(this.GetWorldRotationCoords(wise));
    }
    ChangeCoords(_newCoords) {
        this.blocks.forEach((block, i) => {
            block.coord = _newCoords[i];
        });
    }
    Move(moveCoord) {
        this.coord.add(moveCoord);
        this.blocks.forEach(block => {
            block.Move(moveCoord);
        });
    }
}
