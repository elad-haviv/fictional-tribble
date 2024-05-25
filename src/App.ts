import AssetManager from "./Services/AssetManager";
import Component from "./Components/Component";
import KeyboardHandler from "./Services/KeyboardHandler";
import MouseHandler from "./Services/MouseHandler";
import ScreenManager from "./Services/ScreenManager";

export type AppOptions = {
    isResizable?: boolean;
    width?: number;
    height?: number;
};

export default class App {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    components: Set<Component> = new Set<Component>;

    isResizable: boolean = true;
    isPaused: boolean = false;
    width: number = 0;
    height: number = 0;

    mouseHandler: MouseHandler;
    keyboardHandler: KeyboardHandler;
    assets: AssetManager;
    screenManager: ScreenManager;

    lastTime: number = 0;

    constructor(canvas: HTMLCanvasElement, options?: AppOptions) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d")!;

        this.resizeCanvasToAvailableSize();
        window.addEventListener("resize", () => {
            if (this.isResizable) {
                this.resizeCanvasToAvailableSize();
            }
        });

        this.assets = new AssetManager();
        this.keyboardHandler = new KeyboardHandler();
        this.mouseHandler = new MouseHandler();
        this.screenManager = new ScreenManager(this);
    }

    start() {
        this.init();
        requestAnimationFrame(this.loop.bind(this));
    }

    init() {
        this.components.forEach((component) => {
            component.init();
        });
    }

    loop(timeStamp: number) {
        const deltaTime : number = (timeStamp - this.lastTime) / 1000;
        this.lastTime = timeStamp;

        this.update(timeStamp);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
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
