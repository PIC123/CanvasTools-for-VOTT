import CTSelection = require("./CanvasTools.Selection");
import Selection = CTSelection.CanvasTools.Selection;
import CTRegionMgr = require("./Regions/CanvasTools.Regions.RegionsManager");
import CTRegionBase = require("./Regions/CanvasTools.Regions.Base");
import RegionsManager = CTRegionMgr.CanvasTools.Region.RegionsManager;
import RegionComponent = CTRegionBase.CanvasTools.Region.RegionBase.RegionComponentPrototype;
import CTToolbar = require("./CanvasTools.Toolbar");
import Toolbar = CTToolbar.CanvasTools.Toolbar;
import CTFilter = require("./CanvasTools.Filter");
import Filter = CTFilter.CanvasTools.Filter;
export declare module CanvasTools.Editor {
    type ToolbarIconDescription = {
        type: Toolbar.ToolbarItemType.SELECTOR | Toolbar.ToolbarItemType.SWITCH;
        action: string;
        iconFile: string;
        tooltip: string;
        keycode: string;
        actionCallback: (action: string, rm: RegionsManager, sl: Selection.AreaSelector) => void;
        width?: number;
        height?: number;
        activate: boolean;
    } | {
        type: Toolbar.ToolbarItemType.SEPARATOR;
    };
    class Editor {
        private static SVGDefsTemplate;
        private toolbar;
        private regionsManager;
        private areaSelector;
        private filterPipeline;
        private editorSVG;
        private contentCanvas;
        private editorDiv;
        private isRMFrozen;
        autoResize: boolean;
        constructor(editorZone: HTMLDivElement);
        private createSVGElement;
        private createCanvasElement;
        onRegionManipulationBegin(region?: RegionComponent): void;
        onRegionManipulationEnd(region?: RegionComponent): void;
        onRegionSelected(id: string, multiselection: boolean): void;
        onRegionMove(id: string, x: number, y: number, width: number, height: number): void;
        onRegionDelete(id: string): void;
        onSelectionBegin(): void;
        onSelectionEnd(commit: any): void;
        static FullToolbarSet: Array<ToolbarIconDescription>;
        static RectToolbarSet: Array<ToolbarIconDescription>;
        addToolbar(toolbarZone: HTMLDivElement, toolbarSet: Array<ToolbarIconDescription>, iconsPath: string): void;
        addContentSource(source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement): Promise<void>;
        resize(containerWidth: number, containerHeight: number): void;
        readonly RM: RegionsManager;
        readonly FilterPipeline: Filter.FilterPipeline;
    }
}
