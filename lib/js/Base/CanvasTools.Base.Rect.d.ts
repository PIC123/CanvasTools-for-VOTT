import base = require("./CanvasTools.Base.Interfaces");
import IBase = base.CanvasTools.Base.Interfaces;
export declare namespace CanvasTools.Base.Rect {
    class Rect implements IBase.IRect, IBase.IResizable {
        width: number;
        height: number;
        constructor(width: number, height: number);
        resize(width: number, height: number): void;
        copy(): Rect;
    }
}
