import App from "./App";

export default abstract class Component {
    app: App;

    constructor(app: App) {
        this.app = app;
    }

    public abstract init() : void;
    public abstract update(deltaTime: number) : void;
    public abstract render() : void;
    public abstract destroy() : void;
}