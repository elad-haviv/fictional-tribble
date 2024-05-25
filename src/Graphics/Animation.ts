import SpriteSheet from "./SpriteSheet";

export default class Animation {
    private spriteSheet: SpriteSheet;
    private frames: Array<number>;
    private frameDuration: number;
    private currentFrame: number;
    private elapsedTime: number;
    private loop: boolean;

    constructor(spriteSheet: SpriteSheet, frames: Array<number>, frameDuration: number, loop: boolean) {
        this.spriteSheet = spriteSheet;
        this.frames = frames;
        this.frameDuration = frameDuration;
        this.currentFrame = 0;
        this.elapsedTime = 0;
        this.loop = loop;
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;
        if (this.elapsedTime >= this.frameDuration) {
            this.elapsedTime = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frames.length - 1;
                }
            }
        }
    }

    getCurrentFrame(): CanvasImageSource {
        return this.spriteSheet.getFrame(this.frames[this.currentFrame]);
    }

    getCurrentFrameIndex(): number {
        return this.frames[this.currentFrame];
    }

    isDone(): boolean {
        return !this.loop && this.currentFrame === this.frames.length - 1;
    }

    reset() {
        this.currentFrame = 0;
        this.elapsedTime = 0;
    }
}