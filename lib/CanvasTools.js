"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTools_Toolbar_1 = require("./CanvasTools.Toolbar");
const CanvasTools_RegionsManager_1 = require("./CanvasTools.RegionsManager");
const CanvasTools_PointRegion_1 = require("./CanvasTools.PointRegion");
const CanvasTools_RectRegion_1 = require("./CanvasTools.RectRegion");
const CanvasTools_Selection_1 = require("./CanvasTools.Selection");
const CanvasTools_Filter_1 = require("./CanvasTools.Filter");
const CanvasTools_Rect_1 = require("./Core/CanvasTools.Rect");
const CanvasTools_Point2D_1 = require("./Core/CanvasTools.Point2D");
const CanvasTools_Tags_1 = require("./Core/CanvasTools.Tags");
const CanvasTools_Editor_1 = require("./CanvasTools.Editor");
var CanvasTools;
(function (CanvasTools) {
    CanvasTools.Core = {
        Rect: CanvasTools_Rect_1.Rect,
        Point2D: CanvasTools_Point2D_1.Point2D,
        TagsDescriptor: CanvasTools_Tags_1.TagsDescriptor,
        Tag: CanvasTools_Tags_1.Tag
    };
    CanvasTools.Selection = {
        AreaSelector: CanvasTools_Selection_1.AreaSelector,
        SelectionMode: CanvasTools_Selection_1.SelectionMode
    };
    CanvasTools.Region = {
        RegionsManager: CanvasTools_RegionsManager_1.RegionsManager,
        PointRegion: CanvasTools_PointRegion_1.PointRegion,
        RectRegion: CanvasTools_RectRegion_1.RectRegion
    };
    CanvasTools.Filters = {
        InvertFilter: CanvasTools_Filter_1.InvertFilter,
        GrayscaleFilter: CanvasTools_Filter_1.GrayscaleFilter
    };
    CanvasTools.Editor = CanvasTools_Editor_1.Editor;
    CanvasTools.Toolbar = CanvasTools_Toolbar_1.Toolbar;
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
require("./../css/canvastools.css");
//# sourceMappingURL=CanvasTools.js.map