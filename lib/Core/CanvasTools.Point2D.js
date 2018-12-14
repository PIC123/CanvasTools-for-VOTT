"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.Point2D = Point2D;
//# sourceMappingURL=CanvasTools.Point2D.js.map