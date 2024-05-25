import Component, { ComponentInterface } from "../Components/Component";

export abstract class Screen implements ComponentInterface {
    public init(): void {}
    public update(deltaTime: number): void {}
    public render(): void {}
    public destroy(): void {}
}

export class Overlay implements ComponentInterface {
    public init(): void {}
    public update(deltaTime: number): void {}
    public render(): void {}
    public destroy(): void {}

    public show(): void {}
    public hide(): void {}
}

export default class ScreenManager extends Component {
    private screens: Screen[] = [];
    private overlays: Overlay[] = [];
    private currentScreen: Screen | null = null;

    public addScreen(screen: Screen): void {
        this.screens.push(screen);
    }

    public addOverlay(overlay: Overlay): void {
        this.overlays.push(overlay);
    }

    public showScreen(screen: Screen): void {
        if (this.currentScreen) {
            this.currentScreen.destroy();
        }

        this.currentScreen = screen;
        this.currentScreen.init();
    }

    public showOverlay(overlay: Overlay): void {
        this.overlays.push(overlay);
        overlay.show();
    }

    public hideOverlay(overlay: Overlay): void {
        this.overlays = this.overlays.filter(o => o !== overlay);
        overlay.hide();
    }

    public init(): void {
        this.screens.forEach(screen => screen.init());
        this.overlays.forEach(overlay => overlay.init());
    }

    public update(deltaTime: number): void {
        if (this.currentScreen) {
            this.currentScreen.update(deltaTime);
        }

        this.overlays.forEach(overlay => overlay.update(deltaTime));
    }

    public render(): void {
        if (this.currentScreen) {
            this.currentScreen.render();
        }

        this.overlays.forEach(overlay => overlay.render());
    }

    public destroy(): void {
        if (this.currentScreen) {
            this.currentScreen.destroy();
        }

        this.overlays.forEach(overlay => overlay.destroy());
    }
}
