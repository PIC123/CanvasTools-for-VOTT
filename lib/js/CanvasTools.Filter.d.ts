export declare module CanvasTools.Filter {
    type FilterFunction = (canvas: HTMLCanvasElement) => Promise<HTMLCanvasElement>;
    function InvertFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
    function GrayscaleFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
    class FilterPipeline {
        private pipeline;
        constructor();
        addFilter(filter: FilterFunction): void;
        clearPipeline(): void;
        applyToCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
    }
}
