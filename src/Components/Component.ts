import App from "../App";

export interface ComponentInterface {
    init(): void;
    update(deltaTime: number): void;
    render(): void;
    destroy(): void;
}

export default abstract class Component
    extends EventTarget
    implements ComponentInterface
{
    app: App;

    constructor(app: App) {
        super();

        app.components.add(this);
        this.app = app;
    }

    public init(): void {
        this.dispatchEvent(initEvent);
    }
    public update(deltaTime: number): void {
        this.dispatchEvent(updateEvent);
    }
    public render(): void {
        this.dispatchEvent(renderEvent);
    }
    public destroy(): void {
        this.dispatchEvent(destroyEvent);
        this.app.components.delete(this);
    }
}

const initEvent = new Event("init");
const updateEvent = new Event("update");
const renderEvent = new Event("render");
const destroyEvent = new Event("destroy");
