"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CTBaseRect = require("./Base/CanvasTools.Base.Rect");
var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
const CTSelection = require("./CanvasTools.Selection");
var Selection = CTSelection.CanvasTools.Selection;
const CTRegionMgr = require("./Regions/CanvasTools.Regions.RegionsManager");
var RegionsManager = CTRegionMgr.CanvasTools.Region.RegionsManager;
const CTToolbar = require("./CanvasTools.Toolbar");
var Toolbar = CTToolbar.CanvasTools.Toolbar;
var CanvasTools;
(function (CanvasTools) {
    var Editor;
    (function (Editor_1) {
        class Editor {
            constructor(regionsZone) {
                this.isRMFrozen = false;
                this.regionsManager = new RegionsManager(regionsZone, (region) => {
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
                this.areaSelector = new Selection.AreaSelector(regionsZone, {
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
                this.toolbar = new Toolbar.Toolbar(toolbarZone);
                if (toolbarSet === null) {
                    toolbarSet = Editor.FullToolbarSet;
                }
                let activeSelector;
                toolbarSet.forEach((item) => {
                    if (item.type == Toolbar.ToolbarItemType.SEPARATOR) {
                        this.toolbar.addSeparator();
                    }
                    else if (item.type == Toolbar.ToolbarItemType.SELECTOR) {
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
                    else if (item.type == Toolbar.ToolbarItemType.SWITCH) {
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
            resize(width, height) {
                this.regionsManager.resize(width, height);
                this.areaSelector.resize(width, height);
            }
            get RM() {
                return this.regionsManager;
            }
        }
        Editor.FullToolbarSet = [
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "none-select",
                iconFile: "none-selection.svg",
                tooltip: "Regions Manipulation (M)",
                keycode: 'KeyM',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.NONE);
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SEPARATOR
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "point-select",
                iconFile: "point-selection.svg",
                tooltip: "Point-selection (P)",
                keycode: 'KeyP',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.POINT);
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "rect-select",
                iconFile: "rect-selection.svg",
                tooltip: "Rectangular box (R)",
                keycode: 'KeyR',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.RECT);
                },
                activate: true
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "copy-select",
                iconFile: "copy-t-selection.svg",
                tooltip: "Template-based box (T)",
                keycode: 'KeyT',
                actionCallback: (action, rm, sl) => {
                    let rs = rm.getSelectedRegionsBounds();
                    if (rs !== undefined && rs.length > 0) {
                        let r = rs[0];
                        sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(r.width, r.height) });
                    }
                    else {
                        sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(40, 40) });
                    }
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "polyline-select",
                iconFile: "polyline-selection.svg",
                tooltip: "Polyline-selection (Y)",
                keycode: 'KeyY',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.POLYLINE);
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SEPARATOR
            },
            {
                type: Toolbar.ToolbarItemType.SWITCH,
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
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "none-select",
                iconFile: "none-selection.svg",
                tooltip: "Regions Manipulation (M)",
                keycode: 'KeyM',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.NONE);
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SEPARATOR
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "rect-select",
                iconFile: "rect-selection.svg",
                tooltip: "Rectangular box (R)",
                keycode: 'KeyR',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.RECT);
                },
                activate: true
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "copy-select",
                iconFile: "copy-t-selection.svg",
                tooltip: "Template-based box (T)",
                keycode: 'KeyT',
                actionCallback: (action, rm, sl) => {
                    let rs = rm.getSelectedRegionsBounds();
                    if (rs !== undefined && rs.length > 0) {
                        let r = rs[0];
                        sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(r.width, r.height) });
                    }
                    else {
                        sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(40, 40) });
                    }
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SEPARATOR
            },
            {
                type: Toolbar.ToolbarItemType.SWITCH,
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
        Editor_1.Editor = Editor;
    })(Editor = CanvasTools.Editor || (CanvasTools.Editor = {}));
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
//# sourceMappingURL=CanvasTools.Editor.js.map