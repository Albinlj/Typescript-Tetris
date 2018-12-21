"use strict";
var Shape;
(function (Shape) {
    Shape[Shape["I"] = 0] = "I";
    Shape[Shape["J"] = 1] = "J";
    Shape[Shape["L"] = 2] = "L";
    Shape[Shape["O"] = 3] = "O";
    Shape[Shape["S"] = 4] = "S";
    Shape[Shape["T"] = 5] = "T";
    Shape[Shape["Z"] = 6] = "Z";
})(Shape || (Shape = {}));
var Rotation;
(function (Rotation) {
    Rotation[Rotation["Clockwise"] = 0] = "Clockwise";
    Rotation[Rotation["Counterclockwise"] = 1] = "Counterclockwise";
})(Rotation || (Rotation = {}));
