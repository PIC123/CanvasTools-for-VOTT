"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Snap = require("snapsvg");
const CTBaseRect = require("./Base/CanvasTools.Base.Rect");
var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
var CanvasTools;
(function (CanvasTools) {
    var Toolbar;
    (function (Toolbar_1) {
        let ToolbarItemType;
        (function (ToolbarItemType) {
            ToolbarItemType[ToolbarItemType["SELECTOR"] = 0] = "SELECTOR";
            ToolbarItemType[ToolbarItemType["SWITCH"] = 1] = "SWITCH";
            ToolbarItemType[ToolbarItemType["SEPARATOR"] = 2] = "SEPARATOR";
        })(ToolbarItemType = Toolbar_1.ToolbarItemType || (Toolbar_1.ToolbarItemType = {}));
        ;
        class ToolbarIconPrototype {
            constructor(paper, icon) {
                this.isSelected = false;
                this.paper = paper;
                if (icon !== undefined && icon !== null) {
                    this.description = icon;
                    if (icon.width !== undefined) {
                        this.width = icon.width;
                    }
                    else {
                        this.width = ToolbarIconPrototype.IconWidth;
                    }
                    if (icon.height !== undefined) {
                        this.height = icon.height;
                    }
                    else {
                        this.height = ToolbarIconPrototype.IconHeight;
                    }
                }
                else {
                    this.description = null;
                    this.width = ToolbarIconPrototype.IconWidth;
                    this.height = ToolbarIconPrototype.IconHeight;
                }
            }
            move(x, y) {
                this.x = x;
                this.y = y;
            }
            resize(width, height) {
                this.width = width;
                this.height = height;
            }
            select() {
                this.node.addClass("selected");
                this.isSelected = true;
            }
            unselect() {
                this.node.removeClass("selected");
                this.isSelected = false;
            }
            toggleSelection() {
                if (this.isSelected) {
                    this.unselect();
                }
                else {
                    this.select();
                }
            }
        }
        ToolbarIconPrototype.IconWidth = 48;
        ToolbarIconPrototype.IconHeight = 48;
        class ToolbarSelectIcon extends ToolbarIconPrototype {
            constructor(paper, icon, onAction) {
                super(paper, icon);
                this.onAction = onAction;
                this.buildIconUI();
            }
            buildIconUI() {
                this.node = this.paper.g();
                this.node.addClass("iconStyle");
                this.node.addClass("selector");
                this.iconBackgrounRect = this.paper.rect(0, 0, this.width, this.height);
                this.iconBackgrounRect.addClass("iconBGRectStyle");
                this.iconImage = this.paper.g();
                if (this.description.iconUrl !== undefined) {
                    Snap.load(this.description.iconUrl, (fragment) => {
                        this.iconImage.append(fragment);
                        this.iconImageSVG = this.iconImage.children().find((element) => {
                            return (element.type === "svg");
                        });
                        if (this.iconImageSVG !== undefined) {
                            this.iconImageSVG.attr({
                                width: this.width,
                                height: this.height
                            });
                            this.move(this.x, this.y);
                        }
                    });
                }
                this.iconImage.addClass("iconImageStyle");
                let title = Snap.parse(`<title>${this.description.tooltip}</title>`);
                this.node.add(this.iconBackgrounRect);
                this.node.add(this.iconImage);
                this.node.append(title);
                this.node.click((e) => {
                    this.activate();
                });
            }
            activate() {
                this.onAction(this.description.action);
                this.select();
            }
            move(x, y) {
                super.move(x, y);
                this.iconBackgrounRect.attr({ x: x, y: y });
                if (this.iconImageSVG !== undefined) {
                    this.iconImageSVG.attr({ x: x, y: y });
                }
            }
            resize(width, height) {
                super.resize(width, height);
                this.iconBackgrounRect.attr({
                    width: this.width,
                    height: this.height
                });
                this.iconImageSVG.attr({
                    width: this.width,
                    height: this.height
                });
            }
        }
        Toolbar_1.ToolbarSelectIcon = ToolbarSelectIcon;
        class ToolbarSwitchIcon extends ToolbarIconPrototype {
            constructor(paper, icon, onAction) {
                super(paper, icon);
                this.onAction = onAction;
                this.buildIconUI();
            }
            buildIconUI() {
                this.node = this.paper.g();
                this.node.addClass("iconStyle");
                this.node.addClass("switch");
                this.iconBackgrounRect = this.paper.rect(0, 0, this.width, this.height);
                this.iconBackgrounRect.addClass("iconBGRectStyle");
                this.iconImage = this.paper.g();
                if (this.description.iconUrl !== undefined) {
                    Snap.load(this.description.iconUrl, (fragment) => {
                        this.iconImage.append(fragment);
                        this.iconImageSVG = this.iconImage.children().find((element) => {
                            return (element.type === "svg");
                        });
                        if (this.iconImageSVG !== undefined) {
                            this.iconImageSVG.attr({
                                width: this.width,
                                height: this.height
                            });
                            this.move(this.x, this.y);
                        }
                    });
                }
                this.iconImage.addClass("iconImageStyle");
                let title = Snap.parse(`<title>${this.description.tooltip}</title>`);
                this.node.add(this.iconBackgrounRect);
                this.node.add(this.iconImage);
                this.node.append(title);
                this.node.click((e) => {
                    this.activate();
                });
            }
            activate() {
                this.onAction(this.description.action);
                this.toggleSelection();
            }
            move(x, y) {
                super.move(x, y);
                this.iconBackgrounRect.attr({ x: x, y: y });
                if (this.iconImageSVG !== undefined) {
                    this.iconImageSVG.attr({ x: x, y: y });
                }
            }
            resize(width, height) {
                super.resize(width, height);
                this.iconBackgrounRect.attr({
                    width: this.width,
                    height: this.height
                });
                this.iconImageSVG.attr({
                    width: this.width,
                    height: this.height
                });
            }
        }
        Toolbar_1.ToolbarSwitchIcon = ToolbarSwitchIcon;
        class ToolbarSeparator extends ToolbarIconPrototype {
            constructor(paper, width) {
                super(paper, null);
                this.buildIconUI();
                this.resize(width, 1);
            }
            buildIconUI() {
                this.node = this.paper.g();
                this.node.addClass("iconStyle");
                this.node.addClass("separator");
                this.iconSeparator = this.paper.line(0, 0, this.width, 0);
                this.node.add(this.iconSeparator);
            }
            move(x, y) {
                super.move(x, y);
                this.iconSeparator.attr({
                    x1: x,
                    y1: y,
                    x2: x + this.width,
                    y2: y
                });
            }
            resize(width, height) {
                super.resize(width, 1);
                this.iconSeparator.attr({
                    width: this.width
                });
            }
        }
        Toolbar_1.ToolbarSeparator = ToolbarSeparator;
        class Toolbar {
            constructor(svgHost) {
                this.iconSpace = 8;
                this.areHotKeysEnabled = true;
                this.icons = new Array();
                this.buildUIElements(svgHost);
            }
            buildUIElements(svgHost) {
                this.baseParent = svgHost;
                this.paper = Snap(svgHost);
                this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
                let toolbarGroup = this.paper.g();
                toolbarGroup.addClass("toolbarLayer");
                this.recalculateToolbarSize();
                this.backgroundRect = this.paper.rect(0, 0, this.toolbarWidth, this.toolbarHeight);
                this.backgroundRect.addClass("toolbarBGStyle");
                toolbarGroup.add(this.backgroundRect);
                this.iconsLayer = this.paper.g();
                this.iconsLayer.addClass("iconsLayerStyle");
                toolbarGroup.add(this.iconsLayer);
                this.subscribeToKeyboardEvents();
            }
            recalculateToolbarSize(newIcon) {
                if (newIcon == undefined) {
                    this.toolbarWidth = ToolbarIconPrototype.IconWidth + 2 * this.iconSpace;
                    this.toolbarHeight = this.icons.length * (ToolbarIconPrototype.IconHeight + this.iconSpace) + this.iconSpace;
                }
                else {
                    let width = newIcon.width + 2 * this.iconSpace;
                    if (width > this.toolbarWidth) {
                        this.toolbarWidth = width;
                    }
                    this.toolbarHeight = this.toolbarHeight + newIcon.height + this.iconSpace;
                }
            }
            updateToolbarSize() {
                this.backgroundRect.attr({
                    width: this.toolbarWidth,
                    height: this.toolbarHeight
                });
            }
            addSelector(icon, actor) {
                let newIcon = new ToolbarSelectIcon(this.paper, icon, (action) => {
                    this.select(action);
                    actor(action);
                });
                this.addIcon(newIcon);
            }
            addSwitch(icon, actor) {
                let newIcon = new ToolbarSwitchIcon(this.paper, icon, (action) => {
                    actor(action);
                });
                this.addIcon(newIcon);
            }
            addSeparator() {
                let newIcon = new ToolbarSeparator(this.paper, ToolbarIconPrototype.IconWidth);
                this.addIcon(newIcon);
            }
            addIcon(newIcon) {
                this.icons.push(newIcon);
                this.iconsLayer.add(newIcon.node);
                newIcon.move(this.iconSpace, this.toolbarHeight + this.iconSpace);
                this.recalculateToolbarSize(newIcon);
                this.updateToolbarSize();
            }
            findIconByKeycode(keycode) {
                return this.icons.find((icon) => {
                    return icon.description !== null && icon.description.keycode == keycode;
                });
            }
            findIconByAction(action) {
                return this.icons.find((icon) => {
                    return icon.description !== null && icon.description.action == action;
                });
            }
            subscribeToKeyboardEvents() {
                window.addEventListener("keyup", (e) => {
                    if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
                        if (this.areHotKeysEnabled && !e.ctrlKey && !e.altKey) {
                            let icon = this.findIconByKeycode(e.code);
                            if (icon !== undefined) {
                                if (icon instanceof ToolbarSelectIcon || icon instanceof ToolbarSwitchIcon) {
                                    icon.activate();
                                }
                            }
                        }
                    }
                });
            }
            select(action) {
                this.icons.forEach((icon) => {
                    if (icon instanceof ToolbarSelectIcon) {
                        if (icon.description.action !== action) {
                            icon.unselect();
                        }
                        else {
                            icon.select();
                        }
                    }
                });
            }
            setSwitch(action, on) {
                let switchIcon = this.findIconByAction(action);
                if (switchIcon !== undefined && switchIcon instanceof ToolbarSwitchIcon) {
                    (on) ? switchIcon.select() : switchIcon.unselect();
                }
            }
            enableHotkeys() {
                this.areHotKeysEnabled = true;
            }
            disableHotkeys() {
                this.areHotKeysEnabled = false;
            }
        }
        Toolbar_1.Toolbar = Toolbar;
    })(Toolbar = CanvasTools.Toolbar || (CanvasTools.Toolbar = {}));
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
//# sourceMappingURL=CanvasTools.Toolbar.js.map