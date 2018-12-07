/// <reference types="snapsvg" />
export * from "./Base/CanvasTools.Base.Interfaces";
import * as IBase from "./Base/CanvasTools.Base.Interfaces";
import * as Point2D from "./Base/CanvasTools.Base.Point2D";
import * as Rect from "./Base/CanvasTools.Base.Rect";
import * as Tags from "./Base/CanvasTools.Base.Tags";

import * as SelectionTool from "./CanvasTools.Selection";
import * as FilterTool from "./CanvasTools.Filter";
import * as ToolbarTools from "./CanvasTools.Toolbar";

import * as RegionTools from "./Regions/CanvasTools.Regions.RegionsManager";
import * as PointRegion from "./Regions/CanvasTools.Regions.PointRegion";
import * as RectRegion from "./Regions/CanvasTools.Regions.RectRegion";

import * as EditorTools from "./CanvasTools.Editor";

export module CanvasTools {
    export const Base = {
        Point: Point2D.CanvasTools.Base.Point,
        Rect: Rect.CanvasTools.Base.Rect,
        Tags: Tags.CanvasTools.Base.Tags
    } 

    export const Selection = SelectionTool.CanvasTools.Selection;
    export const Region = {
        RegionsManager: RegionTools.CanvasTools.Region.RegionsManager,
        PointRegion: PointRegion.CanvasTools.Region.PointRegion.PointRegion,
        RectRegion: RectRegion.CanvasTools.Region.RectRegion.RectRegion
    }
    export const Filter = FilterTool.CanvasTools.Filter;
    export const Toolbar = ToolbarTools.CanvasTools.Toolbar;

    export const Editor = EditorTools.CanvasTools.Editor.Editor
}


/* CSS */
import "./../css/canvastools.css";
