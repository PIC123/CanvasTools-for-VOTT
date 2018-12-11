export * from "./Base/CanvasTools.Base.Interfaces";
import Point2D = require("./Base/CanvasTools.Base.Point2D");
import Rect = require("./Base/CanvasTools.Base.Rect");
import Tags = require("./Base/CanvasTools.Base.Tags");
import SelectionTool = require("./CanvasTools.Selection");
import FilterTool = require("./CanvasTools.Filter");
import ToolbarTools = require("./CanvasTools.Toolbar");
import RegionTools = require("./Regions/CanvasTools.Regions.RegionsManager");
import PointRegion = require("./Regions/CanvasTools.Regions.PointRegion");
import RectRegion = require("./Regions/CanvasTools.Regions.RectRegion");
import EditorTools = require("./CanvasTools.Editor");
export declare module CanvasTools {
    const Base: {
        Point: typeof Point2D.CanvasTools.Base.Point;
        Rect: typeof Rect.CanvasTools.Base.Rect;
        Tags: typeof Tags.CanvasTools.Base.Tags;
    };
    const Selection: typeof SelectionTool.CanvasTools.Selection;
    const Region: {
        RegionsManager: typeof RegionTools.CanvasTools.Region.RegionsManager;
        PointRegion: typeof PointRegion.CanvasTools.Region.PointRegion.PointRegion;
        RectRegion: typeof RectRegion.CanvasTools.Region.RectRegion.RectRegion;
    };
    const Filter: typeof FilterTool.CanvasTools.Filter;
    const Toolbar: typeof ToolbarTools.CanvasTools.Toolbar;
    const Editor: typeof EditorTools.CanvasTools.Editor.Editor;
}
import "./../css/canvastools.css";
