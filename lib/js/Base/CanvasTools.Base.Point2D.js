"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasTools;
(function (CanvasTools) {
    var Base;
    (function (Base) {
        var Point;
        (function (Point) {
            class Point2D {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
                boundToRect(r) {
                    let newp = new Point2D(0, 0);
                    newp.x = (this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x);
                    newp.y = (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y);
                    return newp;
                }
            }
            Point.Point2D = Point2D;
        })(Point = Base.Point || (Base.Point = {}));
    })(Base = CanvasTools.Base || (CanvasTools.Base = {}));
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
//# sourceMappingURL=CanvasTools.Base.Point2D.js.map