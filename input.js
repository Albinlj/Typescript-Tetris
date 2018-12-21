class Input {
  constructor(_window) {
    _window.addEventListener("keydown", function(event) {
      switch (event.keyCode) {
        case 37: //Left
          AttemptMove([0, -1]);
          break;
        case 39: //Right
          AttemptMove([0, 1]);
          break;

        case 40: // Down
          AttemptMove([1, 0]);
          break;

        case 38: //Up
          activePiece.Rotate();
          DrawPage();
          break;

        case 88: //X
          HardDrop();
          break;

        default:
          break;
      }

      // console.log(event.keyCode);
    });
  }
}
