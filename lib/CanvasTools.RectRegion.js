"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTools_Point2D_1 = require("./Core/CanvasTools.Point2D");
const CanvasTools_Rect_1 = require("./Core/CanvasTools.Rect");
const CanvasTools_RegionComponent_1 = require("./CanvasTools.RegionComponent");
const Snap = require("snapsvg");
class AnchorsElement extends CanvasTools_RegionComponent_1.RegionComponent {
    constructor(paper, x, y, rect, paperRect = null, onChange, onManipulationBegin, onManipulationEnd) {
        super(paper, paperRect);
        this.x = x;
        this.y = y;
        this.boundRect = rect;
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
    }
    buildOn(paper) {
        this.node = paper.g();
        this.node.addClass("anchorsLayer");
        this.anchors = {
            TL: this.createAnchor(paper, "TL"),
            TR: this.createAnchor(paper, "TR"),
            BL: this.createAnchor(paper, "BL"),
            BR: this.createAnchor(paper, "BR")
        };
        this.ghostAnchor = this.createAnchor(paper, "ghost", 7);
        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
        this.node.add(this.anchors.TL);
        this.node.add(this.anchors.TR);
        this.node.add(this.anchors.BR);
        this.node.add(this.anchors.BL);
        this.node.add(this.ghostAnchor);
        this.subscribeAnchorToEvents(this.anchors.TL, "TL");
        this.subscribeAnchorToEvents(this.anchors.TR, "TR");
        this.subscribeAnchorToEvents(this.anchors.BL, "BL");
        this.subscribeAnchorToEvents(this.anchors.BR, "BR");
        let listeners = [
            { event: "pointerenter", listener: this.onGhostPointerEnter, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerleave", listener: this.onGhostPointerLeave, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerdown", listener: this.onGhostPointerDown, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerup", listener: this.onGhostPointerUp, base: this.ghostAnchor.node, bypass: false },
        ];
        this.subscribeToEvents(listeners);
    }
    subscribeAnchorToEvents(anchor, active) {
        anchor.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.activeAnchor = active;
                let p = this.getDragOriginPoint();
                this.dragOrigin = p;
                this.rectOrigin = this.boundRect.copy();
                this.pointOrigin = new CanvasTools_Point2D_1.Point2D(this.x, this.y);
                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: p.x,
                        cy: p.y,
                        display: 'block'
                    });
                });
            }
        });
    }
    createAnchor(paper, style = "", r = 3) {
        let a = paper.circle(0, 0, r);
        a.addClass("anchorStyle");
        a.addClass(style);
        return a;
    }
    move(p) {
        super.move(p);
        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
    }
    resize(width, height) {
        super.resize(width, height);
        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
    }
    rearrangeAnchors(x1, y1, x2, y2) {
        window.requestAnimationFrame(() => {
            this.anchors.TL.attr({ cx: x1, cy: y1 });
            this.anchors.TR.attr({ cx: x2, cy: y1 });
            this.anchors.BR.attr({ cx: x2, cy: y2 });
            this.anchors.BL.attr({ cx: x1, cy: y2 });
        });
    }
    rearrangeCoord(p1, p2, flipX, flipY) {
        let x = (p1.x < p2.x) ? p1.x : p2.x;
        let y = (p1.y < p2.y) ? p1.y : p2.y;
        let width = Math.abs(p1.x - p2.x);
        let height = Math.abs(p1.y - p2.y);
        this.flipActiveAnchor(flipX, flipY);
        this.onChange(x, y, width, height, CanvasTools_RegionComponent_1.ChangeEventType.MOVING);
    }
    flipActiveAnchor(flipX, flipY) {
        let ac = "";
        if (this.activeAnchor !== "") {
            ac += (this.activeAnchor[0] == "T") ? (flipY ? "B" : "T") : (flipY ? "T" : "B");
            ac += (this.activeAnchor[1] == "L") ? (flipX ? "R" : "L") : (flipX ? "L" : "R");
        }
        if (this.activeAnchor != ac) {
            this.ghostAnchor.removeClass(this.activeAnchor);
            this.activeAnchor = ac;
            this.ghostAnchor.addClass(this.activeAnchor);
        }
        if (flipX) {
            if (this.activeAnchor[1] == "R") {
                this.pointOrigin.x += this.rectOrigin.width;
            }
            this.rectOrigin.width = 0;
        }
        if (flipY) {
            if (this.activeAnchor[0] == "B") {
                this.pointOrigin.y += this.rectOrigin.height;
            }
            this.rectOrigin.height = 0;
        }
    }
    anchorDragBegin() {
        this.originalAnchor = this.activeAnchor;
    }
    getDragOriginPoint() {
        let x, y;
        switch (this.activeAnchor) {
            case "TL": {
                x = this.x;
                y = this.y;
                break;
            }
            case "TR": {
                x = this.x + this.boundRect.width;
                y = this.y;
                break;
            }
            case "BL": {
                x = this.x;
                y = this.y + this.boundRect.height;
                break;
            }
            case "BR": {
                x = this.x + this.boundRect.width;
                y = this.y + this.boundRect.height;
                break;
            }
        }
        return new CanvasTools_Point2D_1.Point2D(x, y);
    }
    anchorDragMove(dx, dy, x, y) {
        let p1, p2;
        let x1, y1, x2, y2;
        let flipX = false;
        let flipY = false;
        x1 = this.dragOrigin.x + dx;
        y1 = this.dragOrigin.y + dy;
        switch (this.activeAnchor) {
            case "TL": {
                x2 = this.pointOrigin.x + this.rectOrigin.width;
                y2 = this.pointOrigin.y + this.rectOrigin.height;
                flipX = x2 < x1;
                flipY = y2 < y1;
                break;
            }
            case "TR": {
                x2 = this.pointOrigin.x;
                y2 = this.pointOrigin.y + this.rectOrigin.height;
                flipX = x1 < x2;
                flipY = y2 < y1;
                break;
            }
            case "BL": {
                y2 = this.pointOrigin.y;
                x2 = this.pointOrigin.x + this.rectOrigin.width;
                flipX = x2 < x1;
                flipY = y1 < y2;
                break;
            }
            case "BR": {
                x2 = this.pointOrigin.x;
                y2 = this.pointOrigin.y;
                flipX = x1 < x2;
                flipY = y1 < y2;
                break;
            }
        }
        p1 = new CanvasTools_Point2D_1.Point2D(x1, y1);
        p2 = new CanvasTools_Point2D_1.Point2D(x2, y2);
        if (this.paperRect !== null) {
            p1 = p1.boundToRect(this.paperRect);
            p2 = p2.boundToRect(this.paperRect);
        }
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({ cx: x1, cy: y1 });
        });
        this.rearrangeCoord(p1, p2, flipX, flipY);
    }
    ;
    anchorDragEnd() {
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none"
            });
        });
    }
    onGhostPointerEnter(e) {
        this.ghostAnchor.drag(this.anchorDragMove.bind(this), this.anchorDragBegin.bind(this), this.anchorDragEnd.bind(this));
        window.requestAnimationFrame(() => {
            this.ghostAnchor.addClass(this.activeAnchor);
        });
        this.onManipulationBegin();
    }
    onGhostPointerLeave(e) {
        this.ghostAnchor.undrag();
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none"
            });
            this.ghostAnchor.removeClass(this.activeAnchor);
        });
        this.onManipulationEnd();
    }
    onGhostPointerDown(e) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);
        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, CanvasTools_RegionComponent_1.ChangeEventType.MOVEBEGIN);
    }
    onGhostPointerUp(e) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, CanvasTools_RegionComponent_1.ChangeEventType.MOVEEND);
    }
    freeze() {
        super.freeze();
        this.ghostAnchor.undrag();
        this.onManipulationEnd();
    }
}
class TagsElement extends CanvasTools_RegionComponent_1.RegionComponent {
    constructor(paper, x, y, rect, paperRect, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect);
        this.styleSheet = null;
        this.boundRect = rect;
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
        this.primaryTagRect = paper.rect(0, 0, this.boundRect.width, this.boundRect.height);
        this.primaryTagRect.addClass("primaryTagRectStyle");
        this.primaryTagText = paper.text(0, 0, "");
        this.primaryTagText.addClass("primaryTagTextStyle");
        this.textBox = this.primaryTagText.getBBox();
        this.primaryTagTextBG = paper.rect(0, 0, 0, 0);
        this.primaryTagTextBG.addClass("primaryTagTextBGStyle");
        this.secondaryTagsGroup = paper.g();
        this.secondaryTagsGroup.addClass("secondatyTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagRect);
        this.node.add(this.primaryTagTextBG);
        this.node.add(this.primaryTagText);
        this.node.add(this.secondaryTagsGroup);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
    updateTags(tags, options) {
        let keepPrimaryText = false;
        if (this.tags && this.tags.primary && tags && tags.primary) {
            keepPrimaryText = (tags.primary.name == this.tags.primary.name);
        }
        this.tags = tags;
        this.redrawTagLabels(keepPrimaryText);
        this.clearColors();
        let showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyColors(showBackground);
    }
    redrawTagLabels(keepPrimaryText = true) {
        for (let i = 0; i < this.secondaryTags.length; i++) {
            this.secondaryTags[i].remove();
        }
        this.secondaryTags = [];
        if (this.tags) {
            if (this.tags.primary !== undefined) {
                if (!keepPrimaryText || this.textBox == undefined) {
                    this.primaryTagText.node.innerHTML = this.tags.primary.name;
                    this.textBox = this.primaryTagText.getBBox();
                }
                let showTextLabel = (this.textBox.width + 10 <= this.boundRect.width) && (this.textBox.height <= this.boundRect.height);
                if (showTextLabel) {
                    window.requestAnimationFrame(() => {
                        this.primaryTagTextBG.attr({
                            width: this.textBox.width + 10,
                            height: this.textBox.height + 5
                        });
                        this.primaryTagText.attr({
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                            visibility: "visible"
                        });
                    });
                }
                else {
                    window.requestAnimationFrame(() => {
                        this.primaryTagTextBG.attr({
                            width: Math.min(10, this.boundRect.width),
                            height: Math.min(10, this.boundRect.height)
                        });
                        this.primaryTagText.attr({
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                            visibility: "hidden"
                        });
                    });
                }
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
        else {
            window.requestAnimationFrame(() => {
                this.primaryTagText.node.innerHTML = "";
                this.primaryTagTextBG.attr({
                    width: 0,
                    height: 0
                });
            });
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
                    rule: `.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorShadow};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                    style: `fill:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle`,
                    style: `stroke:${this.tags.primary.colorDark};
                                fill: ${this.tags.primary.colorPure}`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                    style: `stroke:#fff;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                    style: `fill:transparent;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                    style: `fill:rgba(255,255,255,0.5);`
                }
            ];
            let styleMapLight = [
                {
                    rule: `.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorNoColor};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                    style: `fill:${this.tags.primary.colorShadow};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextStyle`,
                    style: `opacity:0.25;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                    style: `opacity:0.25;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle`,
                    style: `stroke:${this.tags.primary.colorDark};
                                fill: ${this.tags.primary.colorPure}`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                    style: `stroke:#fff;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                    style: `fill:transparent;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                    style: `fill:rgba(255,255,255,0.5);`
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
        let cx = this.x + 0.5 * this.boundRect.width;
        let cy = this.y - size - 5;
        window.requestAnimationFrame(() => {
            this.primaryTagRect.attr({
                x: p.x,
                y: p.y
            });
            this.primaryTagText.attr({
                x: p.x + 5,
                y: p.y + this.textBox.height
            });
            this.primaryTagTextBG.attr({
                x: p.x + 1,
                y: p.y + 1
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
        super.resize(width, height);
        window.requestAnimationFrame(() => {
            this.primaryTagRect.attr({
                width: width,
                height: height
            });
        });
        this.redrawTagLabels();
    }
}
class DragElement extends CanvasTools_RegionComponent_1.RegionComponent {
    constructor(paper, x, y, rect, paperRect = null, onChange, onManipulationBegin, onManipulationEnd) {
        super(paper, paperRect);
        this.isDragged = false;
        this.x = x;
        this.y = y;
        this.boundRect = rect;
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
        this.dragRect = paper.rect(0, 0, this.boundRect.width, this.boundRect.height);
        this.dragRect.addClass("dragRectStyle");
        this.node.add(this.dragRect);
    }
    move(p) {
        super.move(p);
        window.requestAnimationFrame(() => {
            this.dragRect.attr({
                x: p.x,
                y: p.y
            });
        });
    }
    resize(width, height) {
        super.resize(width, height);
        window.requestAnimationFrame(() => {
            this.dragRect.attr({
                width: width,
                height: height
            });
        });
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
        this.dragRect.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.dragRect.undrag();
                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;
                this.onManipulationBegin();
            }
        });
        this.dragRect.node.addEventListener("pointermove", (e) => {
            if (!this.isDragged && !this.isFrozen) {
                this.dragRect.undrag();
                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;
                this.onManipulationBegin();
            }
        });
        this.dragRect.node.addEventListener("pointerleave", (e) => {
            this.dragRect.undrag();
            this.isDragged = false;
            this.onManipulationEnd();
        });
        this.dragRect.node.addEventListener("pointerdown", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.setPointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, CanvasTools_RegionComponent_1.ChangeEventType.MOVEBEGIN, multiselection);
            }
        });
        this.dragRect.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.releasePointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, CanvasTools_RegionComponent_1.ChangeEventType.SELECTIONTOGGLE, multiselection);
            }
        });
    }
    freeze() {
        super.freeze();
        this.dragRect.undrag();
        this.onManipulationEnd();
    }
}
class RectRegion extends CanvasTools_RegionComponent_1.RegionComponent {
    constructor(paper, rect, paperRect = null, id, tagsDescriptor, onManipulationBegin, onManipulationEnd, tagsUpdateOptions) {
        super(paper, paperRect);
        this.styleSheet = null;
        this.isSelected = false;
        this.boundRect = rect;
        this.x = 0;
        this.y = 0;
        this.ID = id;
        this.tags = tagsDescriptor;
        if (paperRect !== null) {
            this.paperRects = {
                host: paperRect,
                actual: new CanvasTools_Rect_1.Rect(paperRect.width - rect.width, paperRect.height - rect.height)
            };
        }
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
        this.anchorsNode = new AnchorsElement(paper, this.x, this.y, this.boundRect, this.paperRects.host, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
        this.dragNode = new DragElement(paper, this.x, this.y, this.boundRect, this.paperRects.actual, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
        this.tagsNode = new TagsElement(paper, this.x, this.y, this.boundRect, this.paperRects.host, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.tagsNode.node);
        this.node.add(this.dragNode.node);
        this.node.add(this.anchorsNode.node);
        this.UI = new Array(this.tagsNode, this.dragNode, this.anchorsNode);
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
        super.resize(width, height);
        this.area = width * height;
        this.paperRects.actual.width = this.paperRects.host.width - width;
        this.paperRects.actual.height = this.paperRects.host.height - height;
        this.UI.forEach((element) => {
            element.resize(width, height);
        });
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
            this.anchorsNode.freeze();
        }
    }
    unfreeze() {
        if (this.isFrozen) {
            this.isFrozen = false;
            this.node.removeClass('old');
            this.dragNode.unfreeze();
            this.anchorsNode.unfreeze();
        }
    }
}
exports.RectRegion = RectRegion;
//# sourceMappingURL=CanvasTools.RectRegion.js.map