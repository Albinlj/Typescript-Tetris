class Piece {
  coord: Vector2D;
  color: number;
  type: number;
  size: number;
  blocks: Block[];
  rotatestate: number = 0;

  constructor(_coord: Vector2D, _type: Shape, _color: number) {
    this.coord = _coord;
    // this.color = _color;
    this.color = _type;
    this.type = _type;

    //Set local coords
    let localBlockCoords: number[][] = [];

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
    let globalBlockCoords = localBlockCoords.map(local =>
      Vector2D.add(new Vector2D(local[0], local[1]), _coord)
    );

    this.blocks = [];

    globalBlockCoords.forEach(coord => {
      this.blocks.push(new Block(coord, this.color));
    });
  }

  GetBlocksLocalCoords(): Vector2D[] {
    return this.blocks.map(block => Vector2D.subtract(block.coord, this.coord));
  }

  GetLocalRotationCoords(wise: Rotation): Vector2D[] {
    if (wise == Rotation.Clockwise) {
      return this.GetBlocksLocalCoords().map(
        local => new Vector2D(local.x, this.size - local.y - 1)
      );
    } else {
      return this.GetBlocksLocalCoords().map(
        local => new Vector2D(this.size - local.x - 1, local.y)
      );
    }
  }

  GetWorldRotationCoords(wise: Rotation): Vector2D[] {
    return this.GetLocalRotationCoords(wise).map(local =>
      Vector2D.add(local, this.coord)
    );
  }

  Rotate(wise: Rotation) {
    this.ChangeCoords(this.GetWorldRotationCoords(wise));
  }

  ChangeCoords(_newCoords: Vector2D[]) {
    this.blocks.forEach((block, i) => {
      block.coord = _newCoords[i];
    });
  }

  Move(moveCoord: Vector2D) {
    this.coord.add(moveCoord);
    this.blocks.forEach(block => {
      block.Move(moveCoord);
    });
  }
}
