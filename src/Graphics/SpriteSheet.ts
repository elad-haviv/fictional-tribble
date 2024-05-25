export default class SpriteSheet {
    image: HTMLImageElement;
    frameWidth: number;
    frameHeight: number;
    frames: Array<CanvasImageSource> = [];

    get frameCount(): number {
        return (this.image.width / this.frameWidth) * (this.image.height / this.frameHeight);
    }

    get cols(): number {
        return this.image.width / this.frameWidth;
    }

    get rows(): number {
        return this.image.height / this.frameHeight;
    }

    constructor(image: HTMLImageElement, frameWidth: number, frameHeight: number) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        for (let y = 0; y < image.height; y += frameHeight) {
            for (let x = 0; x < image.width; x += frameWidth) {
                const canvas = document.createElement("canvas");
                canvas.width = frameWidth;
                canvas.height = frameHeight;
                const context = canvas.getContext("2d");
                context?.drawImage(image, x, y, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
                this.frames.push(canvas);
            }
        }
    }

    getFrame(index: number): CanvasImageSource {
        return this.frames[index];
    }

    getFrameByRowCol(row: number, col: number): CanvasImageSource {
        return this.frames[row * this.cols + col];
    }
}