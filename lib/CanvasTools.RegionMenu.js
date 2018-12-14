"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTools_RegionComponent_1 = require("./CanvasTools.RegionComponent");
const Snap = require("snapsvg");
class MenuElement extends CanvasTools_RegionComponent_1.RegionComponent {
    constructor(paper, x, y, rect, paperRect = null, onManipulationBegin, onManipulationEnd) {
        super(paper, paperRect);
        this.menuItemSize = 20;
        this.mw = this.menuItemSize + 10;
        this.mh = 60;
        this.dh = 20;
        this.dw = 5;
        this.pathCollection = {
            "delete": {
                path: "M 83.4 21.1 L 74.9 12.6 L 48 39.5 L 21.1 12.6 L 12.6 21.1 L 39.5 48 L 12.6 74.9 L 21.1 83.4 L 48 56.5 L 74.9 83.4 L 83.4 74.9 L 56.5 48 Z",
                iconSize: 96
            }
        };
        this.boundRect = rect;
        this.x = x;
        this.y = y;
        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = onManipulationBegin;
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = onManipulationEnd;
        }
        this.buildOn(this.paper);
    }
    buildOn(paper) {
        let menuSVG = this.paper.svg(this.mx, this.my, this.mw, this.mh, this.mx, this.my, this.mw, this.mh);
        this.menuGroup = Snap(menuSVG).paper;
        this.menuGroup.addClass("menuLayer");
        this.rearrangeMenuPosition();
        this.menuRect = this.menuGroup.rect(0, 0, this.mw, this.mh, 5, 5);
        this.menuRect.addClass("menuRectStyle");
        this.menuItemsGroup = this.menuGroup.g();
        this.menuItemsGroup.addClass("menuItems");
        this.menuItems = new Array();
        this.menuGroup.add(this.menuRect);
        this.menuGroup.add(this.menuItemsGroup);
        this.menuGroup.mouseover((e) => {
            this.onManipulationBegin();
        });
        this.menuGroup.mouseout((e) => {
            this.onManipulationEnd();
        });
    }
    addAction(action, icon, actor) {
        let item = this.menuGroup.g();
        let itemBack = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemBack.addClass("menuItemBack");
        let k = (this.menuItemSize - 4) / this.pathCollection.delete.iconSize;
        let itemIcon = this.menuGroup.path(this.pathCollection.delete.path);
        itemIcon.transform(`scale(0.2) translate(26 26)`);
        itemIcon.addClass("menuIcon");
        itemIcon.addClass("menuIcon-" + icon);
        let itemRect = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemRect.addClass("menuItem");
        item.add(itemBack);
        item.add(itemIcon);
        item.add(itemRect);
        item.click((e) => {
            actor(this.region);
        });
        this.menuItemsGroup.add(item);
        this.menuItems.push(item);
    }
    rearrangeMenuPosition() {
        if (this.mh <= this.boundRect.height - this.dh) {
            this.my = this.y + this.boundRect.height / 2 - this.mh / 2;
            if (this.x + this.boundRect.width + this.mw / 2 + this.dw < this.paperRect.width) {
                this.mx = this.x + this.boundRect.width - this.mw / 2;
            }
            else if (this.x - this.mw / 2 - this.dw > 0) {
                this.mx = this.x - this.mw / 2;
            }
            else {
                this.mx = this.x + this.boundRect.width - this.mw - this.dw;
            }
        }
        else {
            if (this.y + this.mh > this.paperRect.height) {
                this.my = this.paperRect.height - this.mh - this.dw;
            }
            else {
                this.my = this.y;
            }
            if (this.x + this.boundRect.width + this.mw + 2 * this.dw < this.paperRect.width) {
                this.mx = this.x + this.boundRect.width + this.dw;
            }
            else if (this.x - this.mw - 2 * this.dw > 0) {
                this.mx = this.x - this.mw - this.dw;
            }
            else {
                this.mx = this.x + this.boundRect.width - this.mw - this.dw;
            }
        }
    }
    attachTo(region) {
        this.region = region;
        this.x = region.x;
        this.y = region.y;
        this.boundRect = region.boundRect;
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my
            });
        });
    }
    move(p) {
        super.move(p);
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my
            });
        });
    }
    resize(width, height) {
        super.resize(width, height);
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my
            });
        });
    }
    hide() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: 'hidden'
            });
        });
    }
    show() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: 'visible'
            });
        });
    }
    showOnRegion(region) {
        this.attachTo(region);
        this.show();
    }
}
exports.MenuElement = MenuElement;
//# sourceMappingURL=CanvasTools.RegionMenu.js.map