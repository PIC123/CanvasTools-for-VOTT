export declare namespace CanvasTools.Base.Interfaces {
    interface IRect {
        width: number;
        height: number;
        resize(width: number, height: number): any;
        copy(): IRect;
    }
    interface IPoint2D {
        x: number;
        y: number;
        boundToRect(rect: IRect): IPoint2D;
    }
    interface IHideable {
        hide(): void;
        show(): void;
    }
    interface IFreezable {
        freeze(): void;
        unfreeze(): void;
    }
    interface IResizable {
        resize(width: number, height: number): void;
    }
    interface IMovable {
        x: number;
        y: number;
        move(point: IPoint2D): void;
    }
    interface IRegionPart extends IHideable, IResizable, IMovable {
        rect: IRect;
    }
}
