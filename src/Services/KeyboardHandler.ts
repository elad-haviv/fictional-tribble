export default class KeyboardHandler {
    public prevKeyState: Set<string>;
    public keyState: Set<string>;

    constructor() {
        this.prevKeyState = new Set<string>();
        this.keyState = new Set<string>();
    }

    init() {
        window.addEventListener("keydown", (event) => {
            if (!this.keyState.has(event.key)) {
                this.prevKeyState.delete(event.key);
            }
            this.keyState.add(event.key);
        });
        window.addEventListener("keyup", (event) => {
            if (this.keyState.has(event.key)) {
                this.prevKeyState.add(event.key);
            }
            this.keyState.delete(event.key);
        });
        window.addEventListener("blur", () => {
            this.keyState.clear();
        });
    }

    isKeyDown(key: string) {
        return this.keyState.has(key);
    }

    isKeyUp(key: string) {
        return !this.keyState.has(key);
    }

    isKeyPressed(key: string) {
        return this.keyState.has(key) && !this.prevKeyState.has(key);
    }

    isAnyKeyDown(keys: string[]) {
        return keys.some((key) => this.keyState.has(key));
    }

    isAnyKeyUp(keys: string[]) {
        return !keys.some((key) => this.keyState.has(key));
    }
}
