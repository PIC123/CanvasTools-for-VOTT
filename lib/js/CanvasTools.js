"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D = require("./Base/CanvasTools.Base.Point2D");
const Rect = require("./Base/CanvasTools.Base.Rect");
const Tags = require("./Base/CanvasTools.Base.Tags");
const SelectionTool = require("./CanvasTools.Selection");
const FilterTool = require("./CanvasTools.Filter");
const ToolbarTools = require("./CanvasTools.Toolbar");
const RegionTools = require("./Regions/CanvasTools.Regions.RegionsManager");
const PointRegion = require("./Regions/CanvasTools.Regions.PointRegion");
const RectRegion = require("./Regions/CanvasTools.Regions.RectRegion");
const EditorTools = require("./CanvasTools.Editor");
var CanvasTools;
(function (CanvasTools) {
    CanvasTools.Base = {
        Point: Point2D.CanvasTools.Base.Point,
        Rect: Rect.CanvasTools.Base.Rect,
        Tags: Tags.CanvasTools.Base.Tags
    };
    CanvasTools.Selection = SelectionTool.CanvasTools.Selection;
    CanvasTools.Region = {
        RegionsManager: RegionTools.CanvasTools.Region.RegionsManager,
        PointRegion: PointRegion.CanvasTools.Region.PointRegion.PointRegion,
        RectRegion: RectRegion.CanvasTools.Region.RectRegion.RectRegion
    };
    CanvasTools.Filter = FilterTool.CanvasTools.Filter;
    CanvasTools.Toolbar = ToolbarTools.CanvasTools.Toolbar;
    CanvasTools.Editor = EditorTools.CanvasTools.Editor.Editor;
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
require("./../css/canvastools.css");
//# sourceMappingURL=CanvasTools.js.map