"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTools_Point2D_1 = require("./Core/CanvasTools.Point2D");
const CanvasTools_Rect_1 = require("./Core/CanvasTools.Rect");
const CanvasTools_RegionComponent_1 = require("./CanvasTools.RegionComponent");
const Snap = require("snapsvg");
class TagsElement extends CanvasTools_RegionComponent_1.RegionComponent {
    constructor(paper, x, y, paperRect, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect);
        this.radius = 3;
        this.styleSheet = null;
        this.boundRect = new CanvasTools_Rect_1.Rect(0, 0);
        this.x = x;
        this.y = y;
        this.styleId = styleId;
        this.styleSheet = styleSheet;
        this.tagsUpdateOptions = tagsUpdateOptions;
        this.buildOn(paper, tags);
    }
    buildOn(paper, tags) {
        this.node = paper.g();
        this.node.addClass("tagsLayer");
        this.primaryTagPoint = paper.circle(0, 0, this.radius);
        this.primaryTagPoint.addClass("primaryTagPointStyle");
        this.secondaryTagsGroup = paper.g();
        this.secondaryTagsGroup.addClass("secondatyTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagPoint);
        this.node.add(this.secondaryTagsGroup);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
    updateTags(tags, options) {
        this.tags = tags;
        this.redrawTagLabels();
        this.clearColors();
        let showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyColors(showBackground);
    }
    redrawTagLabels() {
        for (let i = 0; i < this.secondaryTags.length; i++) {
            this.secondaryTags[i].remove();
        }
        this.secondaryTags = [];
        if (this.tags) {
            if (this.tags.primary !== undefined) {
            }
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                let length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    let stag = this.tags.secondary[i];
                    let s = 6;
                    let x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                    let y = this.y - s - 5;
                    let tagel = this.paper.rect(x, y, s, s);
                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });
                    this.secondaryTagsGroup.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
        }
    }
    clearColors() {
        while (this.styleSheet.cssRules.length > 0) {
            this.styleSheet.deleteRule(0);
        }
    }
    applyColors(showRegionBackground = true) {
        if (this.tags && this.tags.primary !== undefined) {
            let styleMap = [
                {
                    rule: `.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorAccent};
                                stroke:${this.tags.primary.colorHighlight};`
                }
            ];
            let styleMapLight = [
                {
                    rule: `.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorNoColor};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                    style: `opacity:0.25;`
                }
            ];
            window.requestAnimationFrame(() => {
                let sm = (showRegionBackground ? styleMap : styleMapLight);
                for (let i = 0; i < sm.length; i++) {
                    let r = sm[i];
                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                }
                if (this.tags && this.tags.secondary.length > 0) {
                    for (let i = 0; i < this.tags.secondary.length; i++) {
                        let tag = this.tags.secondary[i];
                        let rule = `.secondaryTagStyle.secondaryTag-${tag.name}{
                                fill: ${tag.colorAccent};
                            }`;
                        this.styleSheet.insertRule(rule, 0);
                    }
                }
            });
        }
    }
    move(p) {
        super.move(p);
        let size = 6;
        let cx = this.x;
        let cy = this.y - size - 5;
        window.requestAnimationFrame(() => {
            this.primaryTagPoint.attr({
                cx: p.x,
                cy: p.y
            });
            if (this.secondaryTags && this.secondaryTags.length > 0) {
                let length = this.secondaryTags.length;
                for (let i = 0; i < length; i++) {
                    let stag = this.secondaryTags[i];
                    let x = cx + (2 * i - length + 0.5) * size;
                    stag.attr({
                        x: x,
                        y: cy
                    });
                }
            }
        });
    }
    resize(width, height) {
    }
}
class DragElement extends CanvasTools_RegionComponent_1.RegionComponent {
    constructor(paper, x, y, paperRect = null, onChange, onManipulationBegin, onManipulationEnd) {
        super(paper, paperRect);
        this.isDragged = false;
        this.radius = 7;
        this.x = x;
        this.y = y;
        this.boundRect = new CanvasTools_Rect_1.Rect(0, 0);
        if (onChange !== undefined) {
            this.onChange = onChange;
        }
        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = onManipulationBegin;
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = onManipulationEnd;
        }
        this.buildOn(paper);
        this.subscribeToDragEvents();
    }
    buildOn(paper) {
        this.node = paper.g();
        this.node.addClass("dragLayer");
        this.dragPoint = paper.circle(0, 0, this.radius);
        this.dragPoint.addClass("dragPointStyle");
        this.node.add(this.dragPoint);
    }
    move(p) {
        super.move(p);
        window.requestAnimationFrame(() => {
            this.dragPoint.attr({
                cx: p.x,
                cy: p.y
            });
        });
    }
    resize(width, height) {
    }
    rectDragBegin() {
        this.dragOrigin = new CanvasTools_Point2D_1.Point2D(this.x, this.y);
    }
    rectDragMove(dx, dy) {
        if (dx != 0 && dy != 0) {
            let p = new CanvasTools_Point2D_1.Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);
            if (this.paperRect !== null) {
                p = p.boundToRect(this.paperRect);
            }
            this.onChange(p.x, p.y, this.boundRect.width, this.boundRect.height, CanvasTools_RegionComponent_1.ChangeEventType.MOVING);
        }
    }
    ;
    rectDragEnd() {
        this.dragOrigin = null;
        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, CanvasTools_RegionComponent_1.ChangeEventType.MOVEEND);
    }
    subscribeToDragEvents() {
        this.dragPoint.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.undrag();
                this.dragPoint.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;
                this.onManipulationBegin();
            }
        });
        this.dragPoint.node.addEventListener("pointermove", (e) => {
            if (!this.isDragged && !this.isFrozen) {
                this.dragPoint.undrag();
                this.dragPoint.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;
                this.onManipulationBegin();
            }
        });
        this.dragPoint.node.addEventListener("pointerleave", (e) => {
            this.dragPoint.undrag();
            this.isDragged = false;
            this.onManipulationEnd();
        });
        this.dragPoint.node.addEventListener("pointerdown", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.node.setPointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, CanvasTools_RegionComponent_1.ChangeEventType.MOVEBEGIN, multiselection);
            }
        });
        this.dragPoint.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.node.releasePointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, CanvasTools_RegionComponent_1.ChangeEventType.SELECTIONTOGGLE, multiselection);
            }
        });
    }
    freeze() {
        super.freeze();
        this.dragPoint.undrag();
        this.onManipulationEnd();
    }
}
class PointRegion extends CanvasTools_RegionComponent_1.RegionComponent {
    constructor(paper, paperRect = null, id, tagsDescriptor, onManipulationBegin, onManipulationEnd, tagsUpdateOptions) {
        super(paper, paperRect);
        this.styleSheet = null;
        this.isSelected = false;
        this.boundRect = new CanvasTools_Rect_1.Rect(0, 0);
        this.x = 0;
        this.y = 0;
        this.area = 1.0;
        this.ID = id;
        this.tags = tagsDescriptor;
        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = () => {
                onManipulationBegin(this);
            };
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = () => {
                onManipulationEnd(this);
            };
        }
        this.regionID = this.s8();
        this.styleID = `region_${this.regionID}_style`;
        this.styleSheet = this.insertStyleSheet();
        this.tagsUpdateOptions = tagsUpdateOptions;
        this.buildOn(paper);
    }
    buildOn(paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);
        this.dragNode = new DragElement(paper, this.x, this.y, this.paperRect, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
        this.tagsNode = new TagsElement(paper, this.x, this.y, this.paperRect, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.UI = new Array(this.tagsNode, this.dragNode);
    }
    s8() {
        return Math.floor((1 + Math.random()) * 0x100000000)
            .toString(16)
            .substring(1);
    }
    insertStyleSheet() {
        var style = document.createElement("style");
        style.setAttribute("id", this.styleID);
        document.head.appendChild(style);
        return style.sheet;
    }
    removeStyles() {
        document.getElementById(this.styleID).remove();
    }
    onInternalChange(x, y, width, height, state, multiSelection = false) {
        if (this.x != x || this.y != y) {
            this.move(new CanvasTools_Point2D_1.Point2D(x, y));
        }
        if (this.boundRect.width != width || this.boundRect.height != height) {
            this.resize(width, height);
        }
        this.onChange(this, state, multiSelection);
    }
    updateTags(tags, options) {
        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }
    move(p) {
        super.move(p);
        this.UI.forEach((element) => {
            element.move(p);
        });
    }
    resize(width, height) {
    }
    select() {
        this.isSelected = true;
        this.node.addClass("selected");
    }
    unselect() {
        this.isSelected = false;
        this.node.removeClass("selected");
    }
    freeze() {
        if (!this.isFrozen) {
            this.isFrozen = true;
            this.node.addClass('old');
            this.dragNode.freeze();
        }
    }
    unfreeze() {
        if (this.isFrozen) {
            this.isFrozen = false;
            this.node.removeClass('old');
            this.dragNode.unfreeze();
        }
    }
}
exports.PointRegion = PointRegion;
//# sourceMappingURL=CanvasTools.PointRegion.js.map