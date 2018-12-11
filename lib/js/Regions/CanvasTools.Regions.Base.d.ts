import * as CTBaseInterfaces from "../Base/CanvasTools.Base.Interfaces";
import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
import * as CTBasePoint from "../Base/CanvasTools.Base.Point2D";
import Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
import * as Snap from "snapsvg";
export declare module CanvasTools.Region.RegionBase {
    type ManipulationFunction = (UIElement?: RegionComponentPrototype) => void;
    enum ChangeEventType {
        MOVEEND = 0,
        MOVING = 1,
        MOVEBEGIN = 2,
        SELECTIONTOGGLE = 3
    }
    type ChangeFunction = (x: number, y: number, width: number, height: number, eventType?: ChangeEventType, multiSelection?: boolean) => void;
    type EventDescriptor = {
        event: string;
        listener: (e: PointerEvent | MouseEvent | KeyboardEvent | WheelEvent) => void;
        base: SVGSVGElement | HTMLElement | Window;
        bypass: boolean;
    };
    type TagsUpdateOptions = {
        showRegionBackground: boolean;
    };
    abstract class RegionComponentPrototype implements IBase.IHideable, IBase.IResizable, IBase.IMovable, IBase.IFreezable {
        protected paper: Snap.Paper;
        protected paperRect: IBase.IRect;
        boundRect: IBase.IRect;
        node: Snap.Element;
        x: number;
        y: number;
        protected isVisible: boolean;
        protected isFrozen: boolean;
        onManipulationBegin: ManipulationFunction;
        onManipulationEnd: ManipulationFunction;
        constructor(paper: Snap.Paper, paperRect: IBase.IRect);
        hide(): void;
        show(): void;
        freeze(): void;
        unfreeze(): void;
        resize(width: number, height: number): void;
        resizePaper(width: number, height: number): void;
        move(point: Point2D): void;
        protected subscribeToEvents(listeners: Array<EventDescriptor>): void;
        protected makeFreezable(f: Function, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
    }
}
