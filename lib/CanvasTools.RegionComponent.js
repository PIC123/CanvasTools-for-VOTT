"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTools_Rect_1 = require("./Core/CanvasTools.Rect");
var ChangeEventType;
(function (ChangeEventType) {
    ChangeEventType[ChangeEventType["MOVEEND"] = 0] = "MOVEEND";
    ChangeEventType[ChangeEventType["MOVING"] = 1] = "MOVING";
    ChangeEventType[ChangeEventType["MOVEBEGIN"] = 2] = "MOVEBEGIN";
    ChangeEventType[ChangeEventType["SELECTIONTOGGLE"] = 3] = "SELECTIONTOGGLE";
})(ChangeEventType = exports.ChangeEventType || (exports.ChangeEventType = {}));
;
class RegionComponent {
    constructor(paper, paperRect) {
        this.isVisible = true;
        this.isFrozen = false;
        this.paper = paper;
        this.paperRect = paperRect;
        this.boundRect = new CanvasTools_Rect_1.Rect(0, 0);
    }
    hide() {
        this.node.node.setAttribute("visibility", "hidden");
        this.isVisible = false;
    }
    show() {
        this.node.node.setAttribute("visibility", "visible");
        this.isVisible = true;
    }
    freeze() {
        this.isFrozen = true;
    }
    unfreeze() {
        this.isFrozen = false;
    }
    resize(width, height) {
        this.boundRect.resize(width, height);
    }
    resizePaper(width, height) {
        this.paperRect.resize(width, height);
    }
    move(point) {
        this.x = point.x;
        this.y = point.y;
    }
    subscribeToEvents(listeners) {
        listeners.forEach(e => {
            e.base.addEventListener(e.event, this.makeFreezable(e.listener.bind(this), e.bypass));
        });
    }
    makeFreezable(f, bypass = false) {
        return (args) => {
            if (!this.isFrozen || bypass) {
                f(args);
            }
        };
    }
}
exports.RegionComponent = RegionComponent;
//# sourceMappingURL=CanvasTools.RegionComponent.js.map