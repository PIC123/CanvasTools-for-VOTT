import * as CTBaseInterfaces from "../Base/CanvasTools.Base.Interfaces";
import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
import * as CTRegion from "./CanvasTools.Regions.Base";
import RegionBase = CTRegion.CanvasTools.Region.RegionBase;
import * as Snap from "snapsvg";
export declare module CanvasTools.Region.RegionMenu {
    class MenuElement extends RegionBase.RegionComponentPrototype {
        private menuItemSize;
        private mx;
        private my;
        private mw;
        private mh;
        private dh;
        private dw;
        menuGroup: Snap.Paper;
        menuRect: Snap.Element;
        menuItemsGroup: Snap.Element;
        menuItems: Array<Snap.Element>;
        private region;
        constructor(paper: Snap.Paper, x: number, y: number, rect: IBase.IRect, paperRect?: IBase.IRect, onManipulationBegin?: RegionBase.ManipulationFunction, onManipulationEnd?: RegionBase.ManipulationFunction);
        private buildOn;
        private pathCollection;
        addAction(action: string, icon: string, actor: Function): void;
        private rearrangeMenuPosition;
        attachTo(region: RegionBase.RegionComponentPrototype): void;
        move(p: IBase.IPoint2D): void;
        resize(width: number, height: number): void;
        hide(): void;
        show(): void;
        showOnRegion(region: RegionBase.RegionComponentPrototype): void;
    }
}
