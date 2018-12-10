import * as CTBaseInterfaces from "../Base/CanvasTools.Base.Interfaces";
import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
import * as CTBaseTag from "../Base/CanvasTools.Base.Tags";
import Tags = CTBaseTag.CanvasTools.Base.Tags;
import * as CTRegion from "./CanvasTools.Regions.Base";
import RegionBase = CTRegion.CanvasTools.Region.RegionBase;
import * as Snap from "snapsvg";
export declare module CanvasTools.Region.PointRegion {
    class PointRegion extends RegionBase.RegionComponentPrototype {
        area: number;
        node: Snap.Element;
        private dragNode;
        private tagsNode;
        private toolTip;
        private UI;
        tags: Tags.TagsDescriptor;
        ID: string;
        regionID: string;
        private styleID;
        private styleSheet;
        isSelected: boolean;
        private tagsUpdateOptions;
        onChange: Function;
        constructor(paper: Snap.Paper, paperRect: IBase.IRect, id: string, tagsDescriptor: Tags.TagsDescriptor, onManipulationBegin?: RegionBase.ManipulationFunction, onManipulationEnd?: RegionBase.ManipulationFunction, tagsUpdateOptions?: RegionBase.TagsUpdateOptions);
        private buildOn;
        private s8;
        private insertStyleSheet;
        removeStyles(): void;
        private onInternalChange;
        updateTags(tags: Tags.TagsDescriptor, options?: RegionBase.TagsUpdateOptions): void;
        move(p: IBase.IPoint2D): void;
        resize(width: number, height: number): void;
        select(): void;
        unselect(): void;
        freeze(): void;
        unfreeze(): void;
    }
}
