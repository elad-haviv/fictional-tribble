import Component from "./Component";

export type AppOptions = {
    isResizable?: boolean;
    width?: number;
    height?: number;
};

export default class App {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    components: Component[] = [];

    isResizable: boolean = true;
    width: number = 0;
    height: number = 0;

    constructor(canvas: HTMLCanvasElement, options?: AppOptions) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d")!;

        this.resizeCanvasToAvailableSize();
        window.addEventListener("resize", () => {
            if (this.isResizable) {
                this.resizeCanvasToAvailableSize();
            }
        });
    }

    start() {
        this.init();

        const loop = (timeStamp: number) => {
            this.update(timeStamp);
            this.render();
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    init() {
    
    }

    update(deltaTime: number) {
        this.components.forEach((component) => {
            component.update(deltaTime);
        });
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.components.forEach((component) => {
            component.render();
        });
    }

    destroy() {
        this.components.forEach((component) => {
            component.destroy();
        });
    }

    resizeCanvasToAvailableSize() {
        this.canvas.width = this.canvas.parentElement!.clientWidth;
        this.canvas.height = this.canvas.parentElement!.clientHeight;
    }
}
