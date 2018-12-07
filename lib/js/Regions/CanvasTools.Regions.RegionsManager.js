"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CTBaseRect = require("../Base/CanvasTools.Base.Rect");
var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
const CTBasePoint = require("../Base/CanvasTools.Base.Point2D");
var Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
const CTRegion = require("./CanvasTools.Regions.Base");
var RegionBase = CTRegion.CanvasTools.Region.RegionBase;
const CTRectRegion = require("./CanvasTools.Regions.RectRegion");
var RectRegion = CTRectRegion.CanvasTools.Region.RectRegion.RectRegion;
const CTPointRegion = require("./CanvasTools.Regions.PointRegion");
var PointRegion = CTPointRegion.CanvasTools.Region.PointRegion.PointRegion;
const CTRegionMenu = require("./CanvasTools.Regions.RegionMenu");
var MenuElement = CTRegionMenu.CanvasTools.Region.RegionMenu.MenuElement;
const Snap = require("snapsvg");
var CanvasTools;
(function (CanvasTools) {
    var Region;
    (function (Region) {
        class RegionsManager {
            constructor(svgHost, onManipulationBegin, onManipulationEnd) {
                this.__isFrozen = false;
                this.tagsUpdateOptions = {
                    showRegionBackground: true
                };
                this.justManipulated = false;
                this.baseParent = svgHost;
                this.paper = Snap(svgHost);
                this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
                this.regions = new Array();
                this.onManipulationBegin = onManipulationBegin;
                this.onManipulationEnd = onManipulationEnd;
                this.buildOn(this.paper);
                this.subscribeToEvents();
            }
            get isFrozen() {
                return this.__isFrozen;
            }
            buildOn(paper) {
                this.regionManagerLayer = paper.g();
                this.regionManagerLayer.addClass("regionManager");
                this.menuLayer = paper.g();
                this.menuLayer.addClass("menuManager");
                this.menu = new MenuElement(paper, 0, 0, new Rect(0, 0), this.paperRect, this.onManipulationBegin_local.bind(this), this.onManipulationEnd_local.bind(this));
                this.menu.addAction("delete", "trash", (region) => {
                    this.deleteRegion(region);
                    this.menu.hide();
                });
                this.menuLayer.add(this.menu.menuGroup);
                this.menu.hide();
            }
            subscribeToEvents() {
                this.regionManagerLayer.mouseover((e) => {
                    this.onManipulationBegin();
                });
                this.regionManagerLayer.mouseout((e) => {
                    this.onManipulationEnd();
                });
                window.addEventListener("keyup", (e) => {
                    if (!this.isFrozen) {
                        switch (e.keyCode) {
                            case 9:
                                this.selectNextRegion();
                                break;
                            case 46:
                            case 8:
                                this.deleteSelectedRegions();
                                break;
                            case 38:
                                if (e.ctrlKey) {
                                    if (!e.shiftKey && !e.altKey) {
                                        this.moveSelectedRegions(0, -5);
                                    }
                                    else if (e.shiftKey && !e.altKey) {
                                        this.resizeSelectedRegions(0, -5);
                                    }
                                    else if (e.altKey && !e.shiftKey) {
                                        this.resizeSelectedRegions(0, -5, true);
                                    }
                                }
                                break;
                            case 40:
                                if (e.ctrlKey) {
                                    if (!e.shiftKey && !e.altKey) {
                                        this.moveSelectedRegions(0, 5);
                                    }
                                    else if (e.shiftKey && !e.altKey) {
                                        this.resizeSelectedRegions(0, 5);
                                    }
                                    else if (e.altKey && !e.shiftKey) {
                                        this.resizeSelectedRegions(0, 5, true);
                                    }
                                }
                                break;
                            case 37:
                                if (e.ctrlKey) {
                                    if (!e.shiftKey && !e.altKey) {
                                        this.moveSelectedRegions(-5, 0);
                                    }
                                    else if (e.shiftKey && !e.altKey) {
                                        this.resizeSelectedRegions(-5, 0);
                                    }
                                    else if (e.altKey && !e.shiftKey) {
                                        this.resizeSelectedRegions(-5, 0, true);
                                    }
                                }
                                break;
                            case 39:
                                if (e.ctrlKey) {
                                    if (!e.shiftKey && !e.altKey) {
                                        this.moveSelectedRegions(5, 0);
                                    }
                                    else if (e.shiftKey && !e.altKey) {
                                        this.resizeSelectedRegions(5, 0);
                                    }
                                    else if (e.altKey && !e.shiftKey) {
                                        this.resizeSelectedRegions(5, 0, true);
                                    }
                                }
                                break;
                            default: return;
                        }
                        e.preventDefault();
                    }
                });
                window.addEventListener("keydown", (e) => {
                    if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
                        if (!this.isFrozen) {
                            switch (e.code) {
                                case "KeyA":
                                case "Numpad1":
                                    if (e.ctrlKey) {
                                        this.selectAllRegions();
                                    }
                                    break;
                                case "KeyB":
                                    if (e.ctrlKey) {
                                        this.toggleBackground();
                                    }
                                    break;
                                default: return;
                            }
                        }
                    }
                });
            }
            addRectRegion(id, pointA, pointB, tagsDescriptor) {
                this.menu.hide();
                let x = (pointA.x < pointB.x) ? pointA.x : pointB.x;
                let y = (pointA.y < pointB.y) ? pointA.y : pointB.y;
                let w = Math.abs(pointA.x - pointB.x);
                let h = Math.abs(pointA.y - pointB.y);
                let region = new RectRegion(this.paper, new Rect(w, h), this.paperRect, id, tagsDescriptor, this.onManipulationBegin_local.bind(this), this.onManipulationEnd_local.bind(this), this.tagsUpdateOptions);
                region.area = w * h;
                region.move(new Point2D(x, y));
                region.onChange = this.onRegionUpdate.bind(this);
                this.unselectRegions();
                region.select();
                this.regionManagerLayer.add(region.node);
                this.regions.push(region);
                this.menu.showOnRegion(region);
            }
            addPointRegion(id, point, tagsDescriptor) {
                this.menu.hide();
                let region = new PointRegion(this.paper, this.paperRect, id, tagsDescriptor, this.onManipulationBegin_local.bind(this), this.onManipulationEnd_local.bind(this), this.tagsUpdateOptions);
                region.move(point);
                region.onChange = this.onRegionUpdate.bind(this);
                this.unselectRegions();
                region.select();
                this.regionManagerLayer.add(region.node);
                this.regions.push(region);
                this.menu.showOnRegion(region);
            }
            drawRegion(x, y, rect, id, tagsDescriptor) {
                this.menu.hide();
                let region = new RectRegion(this.paper, rect, this.paperRect, id, tagsDescriptor, this.onManipulationBegin_local.bind(this), this.onManipulationEnd_local.bind(this), this.tagsUpdateOptions);
                region.area = rect.height * rect.width;
                region.move(new Point2D(x, y));
                region.onChange = this.onRegionUpdate.bind(this);
                region.updateTags(region.tags, this.tagsUpdateOptions);
                this.regionManagerLayer.add(region.node);
                this.regions.push(region);
                if (this.regions.length > 1) {
                    this.sortRegionsByArea();
                    this.redrawAllRegions();
                }
            }
            redrawAllRegions() {
                let sr = this.regions;
                window.requestAnimationFrame((e) => {
                    this.regions.forEach((region) => {
                        let node = region.node.remove();
                        this.regionManagerLayer.add(node);
                    });
                });
            }
            sortRegionsByArea() {
                function quickSort(arr, left, right) {
                    var pivot, partitionIndex;
                    if (left < right) {
                        pivot = right;
                        partitionIndex = partition(arr, pivot, left, right);
                        quickSort(arr, left, partitionIndex - 1);
                        quickSort(arr, partitionIndex + 1, right);
                    }
                    return arr;
                }
                function partition(arr, pivot, left, right) {
                    var pivotValue = arr[pivot].area, partitionIndex = left;
                    for (var i = left; i < right; i++) {
                        if (arr[i].area > pivotValue) {
                            swap(arr, i, partitionIndex);
                            partitionIndex++;
                        }
                    }
                    swap(arr, right, partitionIndex);
                    return partitionIndex;
                }
                function swap(arr, i, j) {
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
                let length = this.regions.length;
                if (length > 1) {
                    quickSort(this.regions, 0, this.regions.length - 1);
                }
            }
            lookupRegionByID(id) {
                let region = null;
                let i = 0;
                while (i < this.regions.length && region == null) {
                    if (this.regions[i].ID == id) {
                        region = this.regions[i];
                    }
                    i++;
                }
                return region;
            }
            lookupSelectedRegions() {
                let collection = Array();
                for (var i = 0; i < this.regions.length; i++) {
                    if (this.regions[i].isSelected) {
                        collection.push(this.regions[i]);
                    }
                }
                return collection;
            }
            getSelectedRegionsBounds() {
                let regions = this.lookupSelectedRegions().map((region) => {
                    return {
                        id: region.ID,
                        x: region.x,
                        y: region.y,
                        width: region.boundRect.width,
                        height: region.boundRect.height
                    };
                });
                return regions;
            }
            deleteRegion(region) {
                region.removeStyles();
                region.node.remove();
                this.regions = this.regions.filter((r) => { return r != region; });
                if ((typeof this.onRegionDelete) == "function") {
                    this.onRegionDelete(region.ID);
                }
            }
            deleteSelectedRegions() {
                let collection = this.lookupSelectedRegions();
                for (var i = 0; i < collection.length; i++) {
                    this.deleteRegion(collection[i]);
                }
                this.menu.hide();
                this.selectNextRegion();
                this.onManipulationEnd();
            }
            deleteRegionById(id) {
                let region = this.lookupRegionByID(id);
                if (region != null) {
                    this.deleteRegion(region);
                }
                this.menu.hide();
                this.onManipulationEnd();
            }
            deleteAllRegions() {
                for (let i = 0; i < this.regions.length; i++) {
                    let r = this.regions[i];
                    r.removeStyles();
                    r.node.remove();
                }
                this.regions = [];
                this.menu.hide();
            }
            updateTagsById(id, tagsDescriptor) {
                let region = this.lookupRegionByID(id);
                if (region != null) {
                    region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
                }
            }
            updateTagsForSelectedRegions(tagsDescriptor) {
                let regions = this.lookupSelectedRegions();
                regions.forEach(region => {
                    region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
                });
            }
            selectRegion(region) {
                if (region != null) {
                    this.unselectRegions(region);
                    region.select();
                    this.menu.showOnRegion(region);
                    if ((typeof this.onRegionSelected) == "function") {
                        this.onRegionSelected(region.ID);
                    }
                }
            }
            selectAllRegions() {
                let r = null;
                for (let i = 0; i < this.regions.length; i++) {
                    let r = this.regions[i];
                    r.select();
                    if ((typeof this.onRegionSelected) == "function") {
                        this.onRegionSelected(r.ID);
                    }
                }
                if (r != null) {
                    this.menu.showOnRegion(r);
                }
            }
            selectRegionById(id) {
                let region = this.lookupRegionByID(id);
                this.selectRegion(region);
            }
            selectNextRegion() {
                let region = null;
                let i = 0;
                let length = this.regions.length;
                if (length == 1) {
                    region = this.regions[0];
                }
                else if (length > 1) {
                    while (i < length && region == null) {
                        if (this.regions[i].isSelected) {
                            region = (i == length - 1) ? this.regions[0] : this.regions[i + 1];
                        }
                        i++;
                    }
                }
                if (region == null && length > 0) {
                    region = this.regions[0];
                }
                this.selectRegion(region);
            }
            reshapeRegion(region, dx, dy, dw, dh, inverse = false) {
                let w;
                let h;
                let x;
                let y;
                if (!inverse) {
                    w = region.boundRect.width + Math.abs(dw);
                    h = region.boundRect.height + Math.abs(dh);
                    x = region.x + dx + (dw > 0 ? 0 : dw);
                    y = region.y + dy + (dh > 0 ? 0 : dh);
                }
                else {
                    w = Math.max(0, region.boundRect.width - Math.abs(dw));
                    h = Math.max(0, region.boundRect.height - Math.abs(dh));
                    x = region.x + dx + (dw < 0 ? 0 : dw);
                    y = region.y + dy + (dh < 0 ? 0 : dh);
                }
                let p1 = new Point2D(x, y).boundToRect(this.paperRect);
                let p2 = new Point2D(x + w, y + h).boundToRect(this.paperRect);
                region.move(p1);
                region.resize(p2.x - p1.x, p2.y - p1.y);
            }
            moveSelectedRegions(dx, dy) {
                let regions = this.lookupSelectedRegions();
                regions.forEach(r => {
                    this.reshapeRegion(r, dx, dy, 0, 0);
                });
                this.menu.showOnRegion(regions[0]);
            }
            resizeSelectedRegions(dw, dh, inverse = false) {
                let regions = this.lookupSelectedRegions();
                regions.forEach(r => {
                    this.reshapeRegion(r, 0, 0, dw, dh, inverse);
                });
                this.menu.showOnRegion(regions[0]);
            }
            resize(width, height) {
                let tw = width / this.paperRect.width;
                let th = height / this.paperRect.height;
                this.paperRect.resize(width, height);
                this.menu.hide();
                for (var i = 0; i < this.regions.length; i++) {
                    let r = this.regions[i];
                    r.move(new Point2D(r.x * tw, r.y * th));
                    r.resize(r.boundRect.width * tw, r.boundRect.height * th);
                }
            }
            onManipulationBegin_local(region) {
                this.onManipulationBegin();
            }
            onManipulationEnd_local(region) {
                this.onManipulationEnd();
            }
            onRegionUpdate(region, state, multiSelection) {
                if (state === RegionBase.ChangeEventType.MOVEBEGIN) {
                    if (!multiSelection) {
                        this.unselectRegions(region);
                    }
                    this.menu.hide();
                    if ((typeof this.onRegionSelected) == "function") {
                        this.onRegionSelected(region.ID);
                    }
                    this.justManipulated = false;
                }
                else if (state === RegionBase.ChangeEventType.MOVING) {
                    if ((typeof this.onRegionMove) == "function") {
                        this.onRegionMove(region.ID, region.x, region.y, region.boundRect.width, region.boundRect.height);
                    }
                    this.justManipulated = true;
                }
                else if (state === RegionBase.ChangeEventType.MOVEEND) {
                    if (this.justManipulated) {
                        region.select();
                        this.menu.showOnRegion(region);
                        this.sortRegionsByArea();
                        this.redrawAllRegions();
                    }
                }
                else if (state === RegionBase.ChangeEventType.SELECTIONTOGGLE && !this.justManipulated) {
                    if (!region.isSelected) {
                        if (!multiSelection) {
                            this.unselectRegions(region);
                        }
                        region.select();
                        this.menu.showOnRegion(region);
                        if ((typeof this.onRegionSelected) == "function") {
                            this.onRegionSelected(region.ID);
                        }
                    }
                    else {
                        region.unselect();
                        this.menu.hide();
                        if ((typeof this.onRegionSelected) == "function") {
                            this.onRegionSelected("");
                        }
                    }
                }
            }
            unselectRegions(except) {
                for (var i = 0; i < this.regions.length; i++) {
                    let r = this.regions[i];
                    if (r != except) {
                        r.unselect();
                    }
                }
            }
            toggleBackground() {
                this.tagsUpdateOptions.showRegionBackground = !this.tagsUpdateOptions.showRegionBackground;
                this.regions.forEach((r) => {
                    r.updateTags(r.tags, this.tagsUpdateOptions);
                });
            }
            freeze(nuance) {
                this.regionManagerLayer.addClass("frozen");
                if (nuance !== undefined) {
                    this.regionManagerLayer.addClass(nuance);
                    this.frozenNuance = nuance;
                }
                else {
                    this.frozenNuance = "";
                }
                this.menu.hide();
                this.regions.forEach((region) => {
                    region.freeze();
                });
                this.__isFrozen = true;
            }
            unfreeze() {
                this.regionManagerLayer.removeClass("frozen");
                if (this.frozenNuance !== "") {
                    this.regionManagerLayer.removeClass(this.frozenNuance);
                }
                let selectedRegions = this.lookupSelectedRegions();
                if (selectedRegions.length > 0) {
                    this.menu.showOnRegion(selectedRegions[0]);
                }
                this.regions.forEach((region) => {
                    region.unfreeze();
                });
                this.__isFrozen = false;
            }
            toggleFreezeMode() {
                if (this.isFrozen) {
                    this.unfreeze();
                }
                else {
                    this.freeze();
                }
            }
        }
        Region.RegionsManager = RegionsManager;
    })(Region = CanvasTools.Region || (CanvasTools.Region = {}));
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
//# sourceMappingURL=CanvasTools.Regions.RegionsManager.js.map