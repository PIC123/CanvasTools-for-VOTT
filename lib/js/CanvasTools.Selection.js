"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CTBaseRect = require("./Base/CanvasTools.Base.Rect");
var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
const CTBasePoint = require("./Base/CanvasTools.Base.Point2D");
var Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
const Snap = require("snapsvg");
var CanvasTools;
(function (CanvasTools) {
    var Selection;
    (function (Selection) {
        class ElementPrototype {
            constructor(paper, boundRect) {
                this.isVisible = true;
                this.paper = paper;
                this.boundRect = boundRect;
            }
            hide() {
                this.node.node.setAttribute("visibility", "hidden");
                this.isVisible = false;
            }
            show() {
                this.node.node.setAttribute("visibility", "visible");
                this.isVisible = true;
            }
            resize(width, height) {
                this.boundRect.resize(width, height);
            }
        }
        class CrossElement extends ElementPrototype {
            constructor(paper, boundRect) {
                super(paper, boundRect);
                this.buildUIElements();
                this.hide();
            }
            buildUIElements() {
                let verticalLine = this.paper.line(0, 0, 0, this.boundRect.height);
                let horizontalLine = this.paper.line(0, 0, this.boundRect.width, 0);
                this.node = this.paper.g();
                this.node.addClass("crossStyle");
                this.node.add(verticalLine);
                this.node.add(horizontalLine);
                this.hl = horizontalLine;
                this.vl = verticalLine;
                this.x = 0;
                this.y = 0;
            }
            boundToRect(rect) {
                return new Point2D(this.x, this.y).boundToRect(rect);
            }
            move(p, rect, square = false, ref = null) {
                let np = p.boundToRect(rect);
                if (square) {
                    let dx = Math.abs(np.x - ref.x);
                    let vx = Math.sign(np.x - ref.x);
                    let dy = Math.abs(np.y - ref.y);
                    let vy = Math.sign(np.y - ref.y);
                    let d = Math.min(dx, dy);
                    np.x = ref.x + d * vx;
                    np.y = ref.y + d * vy;
                }
                this.x = np.x;
                this.y = np.y;
                this.vl.node.setAttribute("x1", np.x.toString());
                this.vl.node.setAttribute("x2", np.x.toString());
                this.vl.node.setAttribute("y2", rect.height.toString());
                this.hl.node.setAttribute("y1", np.y.toString());
                this.hl.node.setAttribute("x2", rect.width.toString());
                this.hl.node.setAttribute("y2", np.y.toString());
            }
            resize(width, height) {
                super.resize(width, height);
                this.vl.node.setAttribute("y2", height.toString());
                this.hl.node.setAttribute("x2", width.toString());
            }
        }
        class RectElement extends ElementPrototype {
            constructor(paper, boundRect, rect) {
                super(paper, boundRect);
                this.rect = rect;
                this.buildUIElements();
                this.hide();
            }
            buildUIElements() {
                this.node = this.paper.rect(0, 0, this.rect.width, this.rect.height);
            }
            move(p) {
                this.node.node.setAttribute("x", p.x.toString());
                this.node.node.setAttribute("y", p.y.toString());
            }
            resize(width, height) {
                this.rect.resize(width, height);
                this.node.node.setAttribute("height", height.toString());
                this.node.node.setAttribute("width", width.toString());
            }
        }
        class MaskElement extends ElementPrototype {
            constructor(paper, boundRect, maskOut) {
                super(paper, boundRect);
                this.maskOut = maskOut;
                this.buildUIElements();
                this.resize(boundRect.width, boundRect.height);
                this.hide();
            }
            buildUIElements() {
                this.mask = this.createMask();
                this.maskIn = this.createMaskIn();
                this.maskOut.node.addClass("maskOutStyle");
                let combinedMask = this.paper.g();
                combinedMask.add(this.maskIn.node);
                combinedMask.add(this.maskOut.node);
                this.mask.node.attr({
                    mask: combinedMask
                });
                this.node = this.mask.node;
            }
            createMask() {
                let r = new RectElement(this.paper, this.boundRect, this.boundRect);
                r.node.addClass("maskStyle");
                return r;
            }
            createMaskIn() {
                let r = new RectElement(this.paper, this.boundRect, this.boundRect);
                r.node.addClass("maskInStyle");
                return r;
            }
            resize(width, height) {
                super.resize(width, height);
                this.mask.resize(width, height);
                this.maskIn.resize(width, height);
            }
        }
        let SelectionMode;
        (function (SelectionMode) {
            SelectionMode[SelectionMode["NONE"] = 0] = "NONE";
            SelectionMode[SelectionMode["POINT"] = 1] = "POINT";
            SelectionMode[SelectionMode["RECT"] = 2] = "RECT";
            SelectionMode[SelectionMode["COPYRECT"] = 3] = "COPYRECT";
            SelectionMode[SelectionMode["POLYLINE"] = 4] = "POLYLINE";
        })(SelectionMode = Selection.SelectionMode || (Selection.SelectionMode = {}));
        ;
        let SelectionModificator;
        (function (SelectionModificator) {
            SelectionModificator[SelectionModificator["RECT"] = 0] = "RECT";
            SelectionModificator[SelectionModificator["SQUARE"] = 1] = "SQUARE";
        })(SelectionModificator = Selection.SelectionModificator || (Selection.SelectionModificator = {}));
        ;
        class SelectorPrototype extends ElementPrototype {
            constructor(paper, boundRect, callbacks) {
                super(paper, boundRect);
                this.isEnabled = true;
                if (callbacks !== undefined) {
                    this.callbacks = callbacks;
                }
                else {
                    this.callbacks = {
                        onSelectionBegin: null,
                        onSelectionEnd: null,
                        onLocked: null,
                        onUnlocked: null
                    };
                }
            }
            enable() {
                if (!this.isEnabled) {
                    this.isEnabled = true;
                    this.show();
                }
            }
            disable() {
                if (this.isEnabled) {
                    this.isEnabled = false;
                    this.hide();
                }
            }
            subscribeToEvents(listeners) {
                listeners.forEach(e => {
                    e.base.addEventListener(e.event, this.enablify(e.listener.bind(this), e.bypass));
                });
            }
            enablify(f, bypass = false) {
                return (args) => {
                    if (this.isEnabled || bypass) {
                        f(args);
                    }
                };
            }
            showAll(elements) {
                window.requestAnimationFrame(() => {
                    elements.forEach(element => {
                        element.show();
                    });
                });
            }
            hideAll(elements) {
                window.requestAnimationFrame(() => {
                    elements.forEach(element => {
                        element.hide();
                    });
                });
            }
            resizeAll(elementSet) {
                window.requestAnimationFrame(() => {
                    elementSet.forEach(element => {
                        element.resize(this.boundRect.width, this.boundRect.height);
                    });
                });
            }
        }
        class RectSelector extends SelectorPrototype {
            constructor(parent, paper, boundRect, callbacks) {
                super(paper, boundRect, callbacks);
                this.capturingState = false;
                this.isTwoPoints = false;
                this.selectionModificator = SelectionModificator.RECT;
                this.parentNode = parent;
                this.buildUIElements();
                this.hide();
            }
            buildUIElements() {
                this.node = this.paper.g();
                this.node.addClass("rectSelector");
                this.crossA = new CrossElement(this.paper, this.boundRect);
                this.crossB = new CrossElement(this.paper, this.boundRect);
                this.selectionBox = new RectElement(this.paper, this.boundRect, new Rect(0, 0));
                this.selectionBox.node.addClass("selectionBoxStyle");
                this.mask = new MaskElement(this.paper, this.boundRect, this.selectionBox);
                this.node.add(this.mask.node);
                this.node.add(this.crossA.node);
                this.node.add(this.crossB.node);
                let listeners = [
                    { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
                    { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
                    { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
                    { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
                    { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
                    { event: "keydown", listener: this.onKeyDown, base: window, bypass: false },
                    { event: "keyup", listener: this.onKeyUp, base: window, bypass: true },
                ];
                this.subscribeToEvents(listeners);
            }
            moveCross(cross, p, square = false, refCross = null) {
                cross.move(p, this.boundRect, square, refCross);
            }
            moveSelectionBox(box, crossA, crossB) {
                var x = (crossA.x < crossB.x) ? crossA.x : crossB.x;
                var y = (crossA.y < crossB.y) ? crossA.y : crossB.y;
                var w = Math.abs(crossA.x - crossB.x);
                var h = Math.abs(crossA.y - crossB.y);
                box.move(new Point2D(x, y));
                box.resize(w, h);
            }
            onPointerEnter(e) {
                window.requestAnimationFrame(() => {
                    this.crossA.show();
                });
            }
            onPointerLeave(e) {
                window.requestAnimationFrame(() => {
                    let rect = this.parentNode.getClientRects();
                    let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    if (!this.capturingState) {
                        this.hideAll([this.crossA, this.crossB, this.selectionBox]);
                    }
                    else if (this.isTwoPoints && this.capturingState) {
                        this.moveCross(this.crossB, p);
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                    }
                });
            }
            onPointerDown(e) {
                window.requestAnimationFrame(() => {
                    if (!this.isTwoPoints) {
                        this.capturingState = true;
                        this.parentNode.setPointerCapture(e.pointerId);
                        this.moveCross(this.crossB, this.crossA);
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                        this.showAll([this.mask, this.crossB, this.selectionBox]);
                        if (typeof this.callbacks.onSelectionBegin === "function") {
                            this.callbacks.onSelectionBegin();
                        }
                    }
                });
            }
            onPointerUp(e) {
                window.requestAnimationFrame(() => {
                    let rect = this.parentNode.getClientRects();
                    let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    if (!this.isTwoPoints) {
                        this.capturingState = false;
                        this.parentNode.releasePointerCapture(e.pointerId);
                        this.hideAll([this.crossB, this.mask]);
                        if (typeof this.callbacks.onSelectionEnd === "function") {
                            this.callbacks.onSelectionEnd({
                                boundRect: {
                                    x1: this.crossA.x,
                                    y1: this.crossA.y,
                                    x2: this.crossB.x,
                                    y2: this.crossB.y
                                }
                            });
                        }
                    }
                    else {
                        if (this.capturingState) {
                            this.capturingState = false;
                            this.hideAll([this.crossB, this.mask]);
                            if (typeof this.callbacks.onSelectionEnd === "function") {
                                this.callbacks.onSelectionEnd({
                                    boundRect: {
                                        x1: this.crossA.x,
                                        y1: this.crossA.y,
                                        x2: this.crossB.x,
                                        y2: this.crossB.y
                                    }
                                });
                            }
                            this.moveCross(this.crossA, p);
                            this.moveCross(this.crossB, p);
                        }
                        else {
                            this.capturingState = true;
                            this.moveCross(this.crossB, p);
                            this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                            this.showAll([this.crossA, this.crossB, this.selectionBox, this.mask]);
                            if (typeof this.callbacks.onSelectionBegin === "function") {
                                this.callbacks.onSelectionBegin();
                            }
                        }
                    }
                });
            }
            onPointerMove(e) {
                window.requestAnimationFrame(() => {
                    let rect = this.parentNode.getClientRects();
                    let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.crossA.show();
                    if (!this.isTwoPoints) {
                        if (this.capturingState) {
                            this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                            this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                        }
                        else {
                            this.moveCross(this.crossA, p);
                        }
                    }
                    else {
                        if (this.capturingState) {
                            this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                            this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                        }
                        else {
                            this.moveCross(this.crossA, p);
                            this.moveCross(this.crossB, p);
                        }
                    }
                });
                e.preventDefault();
            }
            onKeyDown(e) {
                if (e.shiftKey) {
                    this.selectionModificator = SelectionModificator.SQUARE;
                }
                if (e.ctrlKey && !this.capturingState) {
                    this.isTwoPoints = true;
                }
            }
            onKeyUp(e) {
                if (!e.shiftKey) {
                    this.selectionModificator = SelectionModificator.RECT;
                }
                if (!e.ctrlKey && this.isTwoPoints) {
                    this.isTwoPoints = false;
                    this.capturingState = false;
                    this.moveCross(this.crossA, this.crossB);
                    this.hideAll([this.crossB, this.selectionBox, this.mask]);
                }
            }
            resize(width, height) {
                super.resize(width, height);
                this.resizeAll([this.mask, this.crossA, this.crossB]);
            }
            hide() {
                super.hide();
                this.hideAll([this.crossA, this.crossB, this.mask]);
            }
            show() {
                super.show();
                this.crossA.show();
            }
        }
        Selection.RectSelector = RectSelector;
        class RectCopySelector extends SelectorPrototype {
            constructor(parent, paper, boundRect, copyRect, callbacks) {
                super(paper, boundRect, callbacks);
                this.parentNode = parent;
                this.copyRect = copyRect;
                this.buildUIElements();
                this.hide();
            }
            buildUIElements() {
                this.node = this.paper.g();
                this.node.addClass("rectCopySelector");
                this.crossA = new CrossElement(this.paper, this.boundRect);
                this.copyRectEl = new RectElement(this.paper, this.boundRect, this.copyRect);
                this.copyRectEl.node.addClass("copyRectStyle");
                this.node.add(this.crossA.node);
                this.node.add(this.copyRectEl.node);
                let listeners = [
                    { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
                    { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
                    { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
                    { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
                    { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
                    { event: "wheel", listener: this.onWheel, base: this.parentNode, bypass: false },
                ];
                this.subscribeToEvents(listeners);
            }
            moveCross(cross, p, square = false, refCross = null) {
                cross.move(p, this.boundRect, square, refCross);
            }
            moveCopyRect(copyRect, crossA) {
                var x = crossA.x - copyRect.rect.width / 2;
                var y = crossA.y - copyRect.rect.height / 2;
                copyRect.move(new Point2D(x, y));
            }
            setTemplate(copyRect) {
                this.copyRect = copyRect;
                this.copyRectEl.resize(copyRect.width, copyRect.height);
                this.moveCopyRect(this.copyRectEl, this.crossA);
            }
            onPointerEnter(e) {
                window.requestAnimationFrame(() => {
                    this.crossA.show();
                    this.copyRectEl.show();
                });
            }
            onPointerLeave(e) {
                window.requestAnimationFrame(() => {
                    this.hide();
                });
            }
            onPointerDown(e) {
                window.requestAnimationFrame(() => {
                    this.show();
                    this.moveCopyRect(this.copyRectEl, this.crossA);
                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                });
            }
            onPointerUp(e) {
                window.requestAnimationFrame(() => {
                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        let p1 = new Point2D(this.crossA.x - this.copyRect.width / 2, this.crossA.y - this.copyRect.height / 2);
                        let p2 = new Point2D(this.crossA.x + this.copyRect.width / 2, this.crossA.y + this.copyRect.height / 2);
                        p1 = p1.boundToRect(this.boundRect);
                        p2 = p2.boundToRect(this.boundRect);
                        this.callbacks.onSelectionEnd({
                            boundRect: {
                                x1: p1.x,
                                y1: p1.y,
                                x2: p2.x,
                                y2: p2.y
                            }
                        });
                    }
                });
            }
            onPointerMove(e) {
                window.requestAnimationFrame(() => {
                    let rect = this.parentNode.getClientRects();
                    let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.crossA.show();
                    this.copyRectEl.show();
                    this.moveCross(this.crossA, p);
                    this.moveCopyRect(this.copyRectEl, this.crossA);
                });
                e.preventDefault();
            }
            onWheel(e) {
                let width = this.copyRect.width;
                let height = this.copyRect.height;
                let k = height / width;
                if (e.shiftKey) {
                    if (e.deltaY > 0) {
                        width *= 1.1;
                        height *= 1.1;
                    }
                    else {
                        width /= 1.1;
                        height /= 1.1;
                    }
                }
                else {
                    if (e.deltaY > 0) {
                        width += 1.0;
                        height += k;
                    }
                    else {
                        width -= 1.0;
                        height -= k;
                    }
                }
                if (width < 1.0) {
                    width = 1.0;
                    height = k;
                }
                if (height < 1.0) {
                    height = 1.0;
                    width = 1.0 / k;
                }
                window.requestAnimationFrame(() => {
                    this.copyRect.resize(width, height);
                    this.copyRectEl.resize(width, height);
                    this.moveCopyRect(this.copyRectEl, this.crossA);
                });
            }
            resize(width, height) {
                super.resize(width, height);
                this.crossA.resize(width, height);
            }
            hide() {
                super.hide();
                this.hideAll([this.crossA, this.copyRectEl]);
            }
            show() {
                super.show();
                this.showAll([this.crossA, this.copyRectEl]);
            }
        }
        Selection.RectCopySelector = RectCopySelector;
        class PointSelector extends SelectorPrototype {
            constructor(parent, paper, boundRect, callbacks) {
                super(paper, boundRect, callbacks);
                this.pointRadius = 6;
                this.parentNode = parent;
                this.buildUIElements();
                this.hide();
            }
            buildUIElements() {
                this.node = this.paper.g();
                this.node.addClass("pointSelector");
                this.crossA = new CrossElement(this.paper, this.boundRect);
                this.point = this.paper.circle(0, 0, this.pointRadius);
                this.point.addClass("pointStyle");
                this.node.add(this.crossA.node);
                this.node.add(this.point);
                let listeners = [
                    { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
                    { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
                    { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
                    { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
                    { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false }
                ];
                this.subscribeToEvents(listeners);
            }
            moveCross(cross, p, square = false, refCross = null) {
                cross.move(p, this.boundRect, square, refCross);
            }
            movePoint(point, crossA) {
                point.attr({
                    cx: crossA.x,
                    cy: crossA.y
                });
            }
            onPointerEnter(e) {
                window.requestAnimationFrame(() => {
                    this.show();
                });
            }
            onPointerLeave(e) {
                window.requestAnimationFrame(() => {
                    this.hide();
                });
            }
            onPointerDown(e) {
                window.requestAnimationFrame(() => {
                    this.show();
                    this.movePoint(this.point, this.crossA);
                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                });
            }
            onPointerUp(e) {
                window.requestAnimationFrame(() => {
                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        let p1 = new Point2D(this.crossA.x - this.pointRadius, this.crossA.y - this.pointRadius);
                        let p2 = new Point2D(this.crossA.x + this.pointRadius, this.crossA.y + this.pointRadius);
                        p1 = p1.boundToRect(this.boundRect);
                        p2 = p2.boundToRect(this.boundRect);
                        this.callbacks.onSelectionEnd({
                            boundRect: {
                                x1: p1.x,
                                y1: p1.y,
                                x2: p2.x,
                                y2: p2.y
                            },
                            meta: {
                                point: {
                                    x: this.crossA.x,
                                    y: this.crossA.y
                                }
                            }
                        });
                    }
                });
            }
            onPointerMove(e) {
                window.requestAnimationFrame(() => {
                    let rect = this.parentNode.getClientRects();
                    let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.show();
                    this.moveCross(this.crossA, p);
                    this.movePoint(this.point, this.crossA);
                });
                e.preventDefault();
            }
            resize(width, height) {
                super.resize(width, height);
                this.crossA.resize(width, height);
            }
            hide() {
                super.hide();
                this.crossA.hide();
                this.point.node.setAttribute("visibility", "hidden");
            }
            show() {
                super.show();
                this.crossA.show();
                this.point.node.setAttribute("visibility", "visible");
            }
        }
        Selection.PointSelector = PointSelector;
        class PolylineSelector extends SelectorPrototype {
            constructor(parent, paper, boundRect, callbacks) {
                super(paper, boundRect, callbacks);
                this.pointRadius = 3;
                this.isCapturing = false;
                this.parentNode = parent;
                this.buildUIElements();
                this.reset();
                this.hide();
            }
            buildUIElements() {
                this.node = this.paper.g();
                this.node.addClass("polylineSelector");
                this.crossA = new CrossElement(this.paper, this.boundRect);
                this.nextPoint = this.paper.circle(0, 0, this.pointRadius);
                this.nextPoint.addClass("nextPointStyle");
                this.nextSegment = this.paper.line(0, 0, 0, 0);
                this.nextSegment.addClass("nextSegmentStyle");
                this.pointsGroup = this.paper.g();
                this.pointsGroup.addClass("polylineGroupStyle");
                this.polyline = this.paper.polyline([]);
                this.polyline.addClass("polylineStyle");
                this.node.add(this.polyline);
                this.node.add(this.pointsGroup);
                this.node.add(this.crossA.node);
                this.node.add(this.nextSegment);
                this.node.add(this.nextPoint);
                let listeners = [
                    { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
                    { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
                    { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
                    { event: "click", listener: this.onClick, base: this.parentNode, bypass: false },
                    { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
                    { event: "dblclick", listener: this.onDoubleClick, base: this.parentNode, bypass: false },
                    { event: "keyup", listener: this.onKeyUp, base: window, bypass: true }
                ];
                this.subscribeToEvents(listeners);
            }
            reset() {
                this.points = new Array();
                this.lastPoint = null;
                let ps = this.pointsGroup.children();
                while (ps.length > 0) {
                    ps[0].remove();
                    ps = this.pointsGroup.children();
                }
                this.polyline.attr({
                    points: ""
                });
                if (this.isCapturing) {
                    this.isCapturing = false;
                }
            }
            moveCross(cross, pointTo, square = false, refCross = null) {
                cross.move(pointTo, this.boundRect, square, refCross);
            }
            movePoint(element, pointTo) {
                element.attr({
                    cx: pointTo.x,
                    cy: pointTo.y
                });
            }
            moveLine(element, pointFrom, pointTo) {
                element.attr({
                    x1: pointFrom.x,
                    y1: pointFrom.y,
                    x2: pointTo.x,
                    y2: pointTo.y
                });
            }
            addPoint(x, y) {
                this.points.push(new Point2D(x, y));
                let point = this.paper.circle(x, y, this.pointRadius);
                point.addClass("polylinePointStyle");
                this.pointsGroup.add(point);
                let pointsStr = "";
                this.points.forEach((p) => {
                    pointsStr += `${p.x},${p.y},`;
                });
                this.polyline.attr({
                    points: pointsStr.substr(0, pointsStr.length - 1)
                });
            }
            onPointerEnter(e) {
                window.requestAnimationFrame(() => {
                    this.show();
                });
            }
            onPointerLeave(e) {
                if (!this.isCapturing) {
                    window.requestAnimationFrame(() => {
                        this.hide();
                    });
                }
                else {
                    let rect = this.parentNode.getClientRects();
                    let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.moveCross(this.crossA, p);
                    this.movePoint(this.nextPoint, p);
                }
            }
            onPointerDown(e) {
                if (!this.isCapturing) {
                    this.isCapturing = true;
                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                }
            }
            onClick(e) {
                if (e.detail <= 1) {
                    window.requestAnimationFrame(() => {
                        let p = new Point2D(this.crossA.x, this.crossA.y);
                        this.addPoint(p.x, p.y);
                        this.lastPoint = p;
                    });
                }
            }
            onPointerMove(e) {
                window.requestAnimationFrame(() => {
                    let rect = this.parentNode.getClientRects();
                    let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.show();
                    this.moveCross(this.crossA, p);
                    this.movePoint(this.nextPoint, p);
                    if (this.lastPoint != null) {
                        this.moveLine(this.nextSegment, this.lastPoint, p);
                    }
                    else {
                        this.moveLine(this.nextSegment, p, p);
                    }
                });
                e.preventDefault();
            }
            onDoubleClick(e) {
                this.submitPolyline();
            }
            submitPolyline() {
                if (typeof this.callbacks.onSelectionEnd === "function") {
                    let box = this.polyline.getBBox();
                    this.callbacks.onSelectionEnd({
                        boundRect: {
                            x1: box.x,
                            y1: box.y,
                            x2: box.x2,
                            y2: box.y2
                        },
                        meta: {
                            polyline: this.points
                        }
                    });
                }
                this.reset();
            }
            onKeyUp(e) {
                if (e.code === "Escape") {
                    this.submitPolyline();
                }
            }
            resize(width, height) {
                super.resize(width, height);
                this.crossA.resize(width, height);
            }
            hide() {
                super.hide();
                this.crossA.hide();
                this.nextPoint.node.setAttribute("visibility", "hidden");
                this.nextSegment.node.setAttribute("visibility", "hidden");
                this.polyline.node.setAttribute("visibility", "hidden");
                this.pointsGroup.node.setAttribute("visibility", "hidden");
            }
            show() {
                super.show();
                this.crossA.show();
                this.nextPoint.node.setAttribute("visibility", "visible");
                this.nextSegment.node.setAttribute("visibility", "visible");
                this.polyline.node.setAttribute("visibility", "visible");
                this.pointsGroup.node.setAttribute("visibility", "visible");
            }
        }
        Selection.PolylineSelector = PolylineSelector;
        class AreaSelector {
            constructor(svgHost, callbacks) {
                this.isEnabled = true;
                this.isVisible = true;
                this.parentNode = svgHost;
                if (callbacks !== undefined) {
                    this.callbacks = callbacks;
                }
                else {
                    this.callbacks = {
                        onSelectionBegin: null,
                        onSelectionEnd: null,
                        onLocked: null,
                        onUnlocked: null
                    };
                }
                this.buildUIElements();
            }
            buildUIElements() {
                this.paper = Snap(this.parentNode);
                this.boundRect = new Rect(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
                this.areaSelectorLayer = this.paper.g();
                this.areaSelectorLayer.addClass("areaSelector");
                this.rectSelector = new RectSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
                this.rectCopySelector = new RectCopySelector(this.parentNode, this.paper, this.boundRect, new Rect(0, 0), this.callbacks);
                this.pointSelector = new PointSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
                this.polylineSelector = new PolylineSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
                this.selector = this.rectSelector;
                this.rectSelector.enable();
                this.rectCopySelector.disable();
                this.pointSelector.disable();
                this.polylineSelector.disable();
                this.selector.hide();
                this.areaSelectorLayer.add(this.rectSelector.node);
                this.areaSelectorLayer.add(this.rectCopySelector.node);
                this.areaSelectorLayer.add(this.pointSelector.node);
                this.areaSelectorLayer.add(this.polylineSelector.node);
            }
            resize(width, height) {
                if (width !== undefined && height !== undefined) {
                    this.boundRect.resize(width, height);
                    this.parentNode.style.width = width.toString();
                    this.parentNode.style.height = height.toString();
                }
                else {
                    this.boundRect.resize(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
                }
                if (this.selector !== null) {
                    this.selector.resize(width, height);
                }
            }
            enable() {
                if (this.selector !== null) {
                    this.selector.enable();
                    this.isEnabled = true;
                    this.selector.resize(this.boundRect.width, this.boundRect.height);
                }
            }
            disable() {
                if (this.selector !== null) {
                    this.selector.disable();
                    this.isEnabled = false;
                }
            }
            show() {
                this.enable();
                this.isVisible = true;
            }
            hide() {
                this.disable();
                this.isVisible = false;
            }
            setSelectionMode(selectionMode, options) {
                this.disable();
                if (selectionMode === SelectionMode.NONE) {
                    this.selector = null;
                    return;
                }
                else if (selectionMode === SelectionMode.COPYRECT) {
                    this.selector = this.rectCopySelector;
                    if (options !== undefined && options.template !== undefined) {
                        this.rectCopySelector.setTemplate(options.template);
                    }
                    else {
                        this.rectCopySelector.setTemplate(AreaSelector.DefaultTemplateSize);
                    }
                }
                else if (selectionMode === SelectionMode.RECT) {
                    this.selector = this.rectSelector;
                }
                else if (selectionMode === SelectionMode.POINT) {
                    this.selector = this.pointSelector;
                }
                else if (selectionMode === SelectionMode.POLYLINE) {
                    this.selector = this.polylineSelector;
                }
                this.enable();
                if (this.isVisible) {
                    this.show();
                }
                else {
                    this.hide();
                }
            }
            enablify(f, bypass = false) {
                return (args) => {
                    if (this.isEnabled || bypass) {
                        f(args);
                    }
                };
            }
        }
        AreaSelector.DefaultTemplateSize = new Rect(20, 20);
        Selection.AreaSelector = AreaSelector;
    })(Selection = CanvasTools.Selection || (CanvasTools.Selection = {}));
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
//# sourceMappingURL=CanvasTools.Selection.js.map