"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasTools;
(function (CanvasTools) {
    var Base;
    (function (Base) {
        var Tags;
        (function (Tags) {
            class Tag {
                constructor(name, colorHue, id = "none") {
                    this.__colorPure = "";
                    this.__colorAccent = "";
                    this.__colorHighlight = "";
                    this.__colorShadow = "";
                    this.__colorNoColor = "";
                    this.__colorDark = "";
                    this.name = name;
                    this.colorHue = colorHue;
                    this.id = id;
                }
                get colorPure() {
                    if (this.__colorPure == "") {
                        this.__colorPure = `hsl(${this.colorHue.toString()}, 100%, 50%)`;
                    }
                    return this.__colorPure;
                }
                get colorAccent() {
                    if (this.__colorAccent == "") {
                        this.__colorAccent = `hsla(${this.colorHue.toString()}, 100%, 50%, 0.5)`;
                    }
                    return this.__colorAccent;
                }
                get colorHighlight() {
                    if (this.__colorHighlight == "") {
                        this.__colorHighlight = `hsla(${this.colorHue.toString()}, 80%, 40%, 0.3)`;
                    }
                    return this.__colorHighlight;
                }
                get colorShadow() {
                    if (this.__colorShadow == "") {
                        this.__colorShadow = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.2)`;
                    }
                    return this.__colorShadow;
                }
                get colorNoColor() {
                    if (this.__colorNoColor == "") {
                        this.__colorNoColor = `rgba(0, 0, 0, 0.0)`;
                    }
                    return this.__colorNoColor;
                }
                get colorDark() {
                    if (this.__colorDark == "") {
                        this.__colorDark = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.8)`;
                    }
                    return this.__colorDark;
                }
                static getHueFromColor(color) {
                    var r = parseInt(color.substring(1, 3), 16) / 255;
                    var g = parseInt(color.substring(3, 5), 16) / 255;
                    var b = parseInt(color.substring(5, 7), 16) / 255;
                    var max = Math.max(r, g, b), min = Math.min(r, g, b);
                    var h, s, l = (max + min) / 2;
                    if (max == min) {
                        h = s = 0;
                    }
                    else {
                        var d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch (max) {
                            case r:
                                h = (g - b) / d + (g < b ? 6 : 0);
                                break;
                            case g:
                                h = (b - r) / d + 2;
                                break;
                            case b:
                                h = (r - g) / d + 4;
                                break;
                        }
                        h /= 6;
                    }
                    return h;
                }
            }
            Tags.Tag = Tag;
            class TagsDescriptor {
                constructor(primaryTag, secondaryTags = []) {
                    this.primary = primaryTag;
                    this.secondary = secondaryTags;
                }
                toString() {
                    let str = this.primary.name;
                    this.secondary.forEach((tag) => {
                        str += " " + tag.name;
                    });
                    return str;
                }
            }
            Tags.TagsDescriptor = TagsDescriptor;
        })(Tags = Base.Tags || (Base.Tags = {}));
    })(Base = CanvasTools.Base || (CanvasTools.Base = {}));
})(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
//# sourceMappingURL=CanvasTools.Base.Tags.js.map