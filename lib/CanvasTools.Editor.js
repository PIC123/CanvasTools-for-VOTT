"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTools_Toolbar_1 = require("./CanvasTools.Toolbar");
const CanvasTools_RegionsManager_1 = require("./CanvasTools.RegionsManager");
const CanvasTools_Selection_1 = require("./CanvasTools.Selection");
const CanvasTools_Filter_1 = require("./CanvasTools.Filter");
const CanvasTools_Rect_1 = require("./Core/CanvasTools.Rect");
class Editor {
    constructor(editorZone) {
        this.isRMFrozen = false;
        this.autoResize = true;
        this.contentCanvas = this.createCanvasElement();
        this.editorSVG = this.createSVGElement();
        this.editorDiv = editorZone;
        this.editorDiv.classList.add("CanvasToolsEditor");
        this.editorDiv.append(this.contentCanvas);
        this.editorDiv.append(this.editorSVG);
        window.addEventListener("resize", (e) => {
            if (this.autoResize) {
                this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
            }
        });
        this.regionsManager = new CanvasTools_RegionsManager_1.RegionsManager(this.editorSVG, (region) => {
            this.areaSelector.hide();
            this.onRegionManipulationBegin(region);
        }, (region) => {
            this.areaSelector.show();
            this.onRegionManipulationEnd(region);
        });
        this.regionsManager.onRegionSelected = (id, multiselection) => {
            this.onRegionSelected(id, multiselection);
        };
        this.regionsManager.onRegionMove = (id, x, y, width, height) => {
            this.onRegionMove(id, x, y, width, height);
        };
        this.regionsManager.onRegionDelete = (id) => {
            this.onRegionDelete(id);
        };
        this.areaSelector = new CanvasTools_Selection_1.AreaSelector(this.editorSVG, {
            onSelectionBegin: () => {
                this.isRMFrozen = this.regionsManager.isFrozen;
                this.regionsManager.freeze();
                this.onSelectionBegin();
            },
            onSelectionEnd: (commit) => {
                if (!this.isRMFrozen) {
                    this.regionsManager.unfreeze();
                }
                this.onSelectionEnd(commit);
            }
        });
        this.filterPipeline = new CanvasTools_Filter_1.FilterPipeline();
        this.resize(editorZone.offsetWidth, editorZone.offsetHeight);
    }
    createSVGElement() {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.innerHTML = Editor.SVGDefsTemplate;
        return svg;
    }
    createCanvasElement() {
        let canvas = document.createElement("canvas");
        return canvas;
    }
    onRegionManipulationBegin(region) {
    }
    onRegionManipulationEnd(region) {
    }
    onRegionSelected(id, multiselection) {
    }
    onRegionMove(id, x, y, width, height) {
    }
    onRegionDelete(id) {
    }
    onSelectionBegin() {
    }
    onSelectionEnd(commit) {
    }
    addToolbar(toolbarZone, toolbarSet, iconsPath) {
        let svg = this.createSVGElement();
        toolbarZone.append(svg);
        this.toolbar = new CanvasTools_Toolbar_1.Toolbar(svg);
        if (toolbarSet === null) {
            toolbarSet = Editor.FullToolbarSet;
        }
        let activeSelector;
        toolbarSet.forEach((item) => {
            if (item.type == CanvasTools_Toolbar_1.ToolbarItemType.SEPARATOR) {
                this.toolbar.addSeparator();
            }
            else if (item.type == CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR) {
                this.toolbar.addSelector({
                    action: item.action,
                    iconUrl: iconsPath + item.iconFile,
                    tooltip: item.tooltip,
                    keycode: item.keycode,
                    width: item.width,
                    height: item.height
                }, (action) => {
                    item.actionCallback(action, this.regionsManager, this.areaSelector);
                });
                if (item.activate) {
                    activeSelector = item.action;
                }
            }
            else if (item.type == CanvasTools_Toolbar_1.ToolbarItemType.SWITCH) {
                this.toolbar.addSwitch({
                    action: item.action,
                    iconUrl: iconsPath + item.iconFile,
                    tooltip: item.tooltip,
                    keycode: item.keycode,
                    width: item.width,
                    height: item.height
                }, (action) => {
                    item.actionCallback(action, this.regionsManager, this.areaSelector);
                });
                this.toolbar.setSwitch(item.action, item.activate);
            }
        });
        this.toolbar.select(activeSelector);
    }
    addContentSource(source) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffCnvs = document.createElement("canvas");
            let context = buffCnvs.getContext("2d");
            if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
                buffCnvs.width = source.width;
                buffCnvs.height = source.height;
            }
            else if (source instanceof HTMLVideoElement) {
                buffCnvs.width = source.videoWidth;
                buffCnvs.height = source.videoHeight;
            }
            context.drawImage(source, 0, 0, buffCnvs.width, buffCnvs.height);
            return this.filterPipeline.applyToCanvas(buffCnvs).then((bcnvs) => {
                this.contentCanvas.width = bcnvs.width;
                this.contentCanvas.height = bcnvs.height;
                let imgContext = this.contentCanvas.getContext("2d");
                imgContext.drawImage(bcnvs, 0, 0, bcnvs.width, bcnvs.height);
            }).then(() => {
                this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
            });
        });
    }
    resize(containerWidth, containerHeight) {
        let imgRatio = this.contentCanvas.width / this.contentCanvas.height;
        let containerRatio = containerWidth / containerHeight;
        let hpadding = 0;
        let vpadding = 0;
        if (imgRatio > containerRatio) {
            vpadding = (containerHeight - containerWidth / imgRatio) / 2;
            this.editorDiv.style.height = `calc(100% - ${vpadding * 2}px)`;
            this.editorDiv.style.width = "";
        }
        else {
            hpadding = (containerWidth - containerHeight * imgRatio) / 2;
            this.editorDiv.style.height = "";
            this.editorDiv.style.width = `calc(100% - ${hpadding * 2}px)`;
        }
        this.editorDiv.style.padding = `${vpadding}px ${hpadding}px`;
        let actualWidth = this.editorSVG.clientWidth;
        let actualHeight = this.editorSVG.clientHeight;
        this.areaSelector.resize(actualWidth, actualHeight);
        this.regionsManager.resize(actualWidth, actualHeight);
    }
    get RM() {
        return this.regionsManager;
    }
    get FilterPipeline() {
        return this.filterPipeline;
    }
}
Editor.SVGDefsTemplate = `
        <defs>
            <filter id="black-glow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.8" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>`;
Editor.FullToolbarSet = [
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR,
        action: "none-select",
        iconFile: "none-selection.svg",
        tooltip: "Regions Manipulation (M)",
        keycode: 'KeyM',
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.NONE);
        },
        activate: false
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SEPARATOR
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR,
        action: "point-select",
        iconFile: "point-selection.svg",
        tooltip: "Point-selection (P)",
        keycode: 'KeyP',
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.POINT);
        },
        activate: false
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR,
        action: "rect-select",
        iconFile: "rect-selection.svg",
        tooltip: "Rectangular box (R)",
        keycode: 'KeyR',
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.RECT);
        },
        activate: true
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR,
        action: "copy-select",
        iconFile: "copy-t-selection.svg",
        tooltip: "Template-based box (T)",
        keycode: 'KeyT',
        actionCallback: (action, rm, sl) => {
            let rs = rm.getSelectedRegionsBounds();
            if (rs !== undefined && rs.length > 0) {
                let r = rs[0];
                sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.COPYRECT, { template: new CanvasTools_Rect_1.Rect(r.width, r.height) });
            }
            else {
                sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.COPYRECT, { template: new CanvasTools_Rect_1.Rect(40, 40) });
            }
        },
        activate: false
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR,
        action: "polyline-select",
        iconFile: "polyline-selection.svg",
        tooltip: "Polyline-selection (Y)",
        keycode: 'KeyY',
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.POLYLINE);
        },
        activate: false
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SEPARATOR
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SWITCH,
        action: "selection-lock",
        iconFile: "selection-lock.svg",
        tooltip: "Lock/unlock regions (L)",
        keycode: 'KeyL',
        actionCallback: (action, rm, sl) => {
            rm.toggleFreezeMode();
        },
        activate: false
    }
];
Editor.RectToolbarSet = [
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR,
        action: "none-select",
        iconFile: "none-selection.svg",
        tooltip: "Regions Manipulation (M)",
        keycode: 'KeyM',
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.NONE);
        },
        activate: false
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SEPARATOR
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR,
        action: "rect-select",
        iconFile: "rect-selection.svg",
        tooltip: "Rectangular box (R)",
        keycode: 'KeyR',
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.RECT);
        },
        activate: true
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SELECTOR,
        action: "copy-select",
        iconFile: "copy-t-selection.svg",
        tooltip: "Template-based box (T)",
        keycode: 'KeyT',
        actionCallback: (action, rm, sl) => {
            let rs = rm.getSelectedRegionsBounds();
            if (rs !== undefined && rs.length > 0) {
                let r = rs[0];
                sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.COPYRECT, { template: new CanvasTools_Rect_1.Rect(r.width, r.height) });
            }
            else {
                sl.setSelectionMode(CanvasTools_Selection_1.SelectionMode.COPYRECT, { template: new CanvasTools_Rect_1.Rect(40, 40) });
            }
        },
        activate: false
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SEPARATOR
    },
    {
        type: CanvasTools_Toolbar_1.ToolbarItemType.SWITCH,
        action: "selection-lock",
        iconFile: "selection-lock.svg",
        tooltip: "Lock/unlock regions (L)",
        keycode: 'KeyL',
        actionCallback: (action, rm, sl) => {
            rm.toggleFreezeMode();
        },
        activate: false
    }
];
exports.Editor = Editor;
//# sourceMappingURL=CanvasTools.Editor.js.map