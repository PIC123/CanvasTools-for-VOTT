"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function InvertFilter(canvas) {
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var buff = document.createElement("canvas");
    buff.width = canvas.width;
    buff.height = canvas.height;
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    buff.getContext("2d").putImageData(imageData, 0, 0);
    return new Promise((resolve, reject) => {
        return resolve(buff);
    });
}
exports.InvertFilter = InvertFilter;
function GrayscaleFilter(canvas) {
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var buff = document.createElement("canvas");
    buff.width = canvas.width;
    buff.height = canvas.height;
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        let gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
    buff.getContext("2d").putImageData(imageData, 0, 0);
    return new Promise((resolve, reject) => {
        return resolve(buff);
    });
}
exports.GrayscaleFilter = GrayscaleFilter;
class FilterPipeline {
    constructor() {
        this.pipeline = new Array();
    }
    addFilter(filter) {
        this.pipeline.push(filter);
    }
    clearPipeline() {
        this.pipeline = new Array();
    }
    applyToCanvas(canvas) {
        let promise = new Promise((resolve, reject) => {
            return resolve(canvas);
        });
        if (this.pipeline.length > 0) {
            this.pipeline.forEach((filter) => {
                promise = promise.then(filter);
            });
        }
        return promise;
    }
}
exports.FilterPipeline = FilterPipeline;
//# sourceMappingURL=CanvasTools.Filter.js.map