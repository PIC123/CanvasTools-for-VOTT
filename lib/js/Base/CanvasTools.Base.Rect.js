"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasTools;
(function (CanvasTools) {
    var Base;
    (function (Base) {
        var Rect;
        (function (Rect_1) {
            class Rect {
                constructor(width, height) {
                    this.resize(width, height);
                }
                resize(width, height) {
                    this.width = width;
                    this.height = height;
                }
                copy() {
                    return new Rect(this.width, this.height);
                }
            }
            Rect_1.Rect = Rect;
        })(Rect = Base.Rect || (Base.Rect = {}));
    })(Base = CanvasTools.Base || (CanvasTools.Base = {}));
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
//# sourceMappingURL=CanvasTools.Base.Rect.js.map