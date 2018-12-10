import CTBaseInterfaces = require("./Base/CanvasTools.Base.Interfaces");
import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
import CTBaseRect = require("./Base/CanvasTools.Base.Rect");
import Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
import * as Snap from "snapsvg";
export declare module CanvasTools.Selection {
    abstract class ElementPrototype implements IBase.IHideable, IBase.IResizable {
        protected paper: Snap.Paper;
        protected boundRect: Rect;
        node: Snap.Element;
        protected isVisible: boolean;
        constructor(paper: Snap.Paper, boundRect: Rect);
        hide(): void;
        show(): void;
        resize(width: number, height: number): void;
    }
    enum SelectionMode {
        NONE = 0,
        POINT = 1,
        RECT = 2,
        COPYRECT = 3,
        POLYLINE = 4
    }
    enum SelectionModificator {
        RECT = 0,
        SQUARE = 1
    }
    type SelectionCommit = {
        boundRect: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        };
        meta?: Object;
    };
    type SelectorCallbacks = {
        onSelectionBegin: () => void;
        onSelectionEnd: (commit: SelectionCommit) => void;
        onLocked?: () => void;
        onUnlocked?: () => void;
    };
    type EventDescriptor = {
        event: string;
        listener: (e: PointerEvent | MouseEvent | KeyboardEvent | WheelEvent) => void;
        base: SVGSVGElement | HTMLElement | Window;
        bypass: boolean;
    };
    abstract class SelectorPrototype extends ElementPrototype {
        protected isEnabled: boolean;
        callbacks: SelectorCallbacks;
        constructor(paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
        enable(): void;
        disable(): void;
        protected subscribeToEvents(listeners: Array<EventDescriptor>): void;
        protected enablify(f: Function, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
        protected showAll(elements: Array<IBase.IHideable>): void;
        protected hideAll(elements: Array<IBase.IHideable>): void;
        protected resizeAll(elementSet: Array<IBase.IResizable>): void;
    }
    class RectSelector extends SelectorPrototype {
        private parentNode;
        private crossA;
        private crossB;
        private selectionBox;
        private mask;
        private capturingState;
        private isTwoPoints;
        private selectionModificator;
        constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
        private buildUIElements;
        private moveCross;
        private moveSelectionBox;
        private onPointerEnter;
        private onPointerLeave;
        private onPointerDown;
        private onPointerUp;
        private onPointerMove;
        private onKeyDown;
        private onKeyUp;
        resize(width: number, height: number): void;
        hide(): void;
        show(): void;
    }
    class RectCopySelector extends SelectorPrototype {
        private parentNode;
        private copyRect;
        private crossA;
        private copyRectEl;
        constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, copyRect: Rect, callbacks?: SelectorCallbacks);
        private buildUIElements;
        private moveCross;
        private moveCopyRect;
        setTemplate(copyRect: Rect): void;
        private onPointerEnter;
        private onPointerLeave;
        private onPointerDown;
        private onPointerUp;
        private onPointerMove;
        private onWheel;
        resize(width: number, height: number): void;
        hide(): void;
        show(): void;
    }
    class PointSelector extends SelectorPrototype {
        private parentNode;
        private crossA;
        private point;
        private pointRadius;
        constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
        private buildUIElements;
        private moveCross;
        private movePoint;
        private onPointerEnter;
        private onPointerLeave;
        private onPointerDown;
        private onPointerUp;
        private onPointerMove;
        resize(width: number, height: number): void;
        hide(): void;
        show(): void;
    }
    class PolylineSelector extends SelectorPrototype {
        private parentNode;
        private crossA;
        private nextPoint;
        private nextSegment;
        private pointsGroup;
        private polyline;
        private points;
        private lastPoint;
        private pointRadius;
        private isCapturing;
        private capturePointerId;
        constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
        private buildUIElements;
        private reset;
        private moveCross;
        private movePoint;
        private moveLine;
        private addPoint;
        private onPointerEnter;
        private onPointerLeave;
        private onPointerDown;
        private onClick;
        private onPointerMove;
        private onDoubleClick;
        private submitPolyline;
        private onKeyUp;
        resize(width: number, height: number): void;
        hide(): void;
        show(): void;
    }
    class AreaSelector {
        private parentNode;
        private paper;
        private boundRect;
        private areaSelectorLayer;
        private selector;
        private rectSelector;
        private rectCopySelector;
        private pointSelector;
        private polylineSelector;
        callbacks: SelectorCallbacks;
        private isEnabled;
        private isVisible;
        static DefaultTemplateSize: Rect;
        constructor(svgHost: SVGSVGElement, callbacks?: SelectorCallbacks);
        private buildUIElements;
        resize(width: number, height: number): void;
        enable(): void;
        disable(): void;
        show(): void;
        hide(): void;
        setSelectionMode(selectionMode: SelectionMode, options?: {
            template?: Rect;
        }): void;
        protected enablify(f: Function, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
    }
}
