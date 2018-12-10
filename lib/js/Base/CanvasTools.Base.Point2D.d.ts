import base = require("./CanvasTools.Base.Interfaces");
import IBase = base.CanvasTools.Base.Interfaces;
export declare namespace CanvasTools.Base.Point {
    class Point2D implements IBase.IPoint2D {
        x: number;
        y: number;
        constructor(x: number, y: number);
        boundToRect(r: IBase.IRect): Point2D;
    }
}
