"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.Rect = Rect;
//# sourceMappingURL=CanvasTools.Rect.js.map