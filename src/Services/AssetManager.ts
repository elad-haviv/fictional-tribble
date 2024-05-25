export default class AssetManager {
    images: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();
    audio: Map<string, HTMLAudioElement> = new Map<string, HTMLAudioElement>();

    constructor() {
        this.images = new Map<string, HTMLImageElement>();
        this.audio = new Map<string, HTMLAudioElement>();
    }

    loadImage(key: string, src: string) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => {
                this.images.set(key, image);
                resolve(image);
            };
            image.onerror = () => {
                reject(new Error(`Failed to load image with src: ${src}`));
            };
        });
    }

    loadAudio(key: string, src: string) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = src;
            audio.oncanplaythrough = () => {
                this.audio.set(key, audio);
                resolve(audio);
            };
            audio.onerror = () => {
                reject(new Error(`Failed to load audio with src: ${src}`));
            };
        });
    }

    getImage(key: string) {
        return this.images.get(key);
    }

    getAudio(key: string) {
        return this.audio.get(key);
    }

    isImageLoaded(key: string) {
        return this.images.has(key);
    }

    isAudioLoaded(key: string) {
        return this.audio.has(key);
    }

    isLoaded() {
        return Array.from(this.images.values()).every((image) => image.complete) &&
            Array.from(this.audio.values()).every((audio) => audio.readyState >= 2);
    }

    playAudio(key: string) {
        const audio = this.audio.get(key);
        if (audio) {
            audio.play();
        }
    }

    stopAudio(key: string) {
        const audio = this.audio.get(key);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    pauseAudio(key: string) {
        const audio = this.audio.get(key);
        if (audio) {
            audio.pause();
        }
    }

    resumeAudio(key: string) {
        const audio = this.audio.get(key);
        if (audio) {
            audio.play();
        }
    }

    loopAudio(key: string) {
        const audio = this.audio.get(key);
        if (audio) {
            audio.loop = true;
        }
    }

    stopLoopAudio(key: string) {
        const audio = this.audio.get(key);
        if (audio) {
            audio.loop = false;
        }
    }

    stopAllAudio() {
        this.audio.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    pauseAllAudio() {
        this.audio.forEach((audio) => {
            audio.pause();
        });
    }

    resumeAllAudio() {
        this.audio.forEach((audio) => {
            audio.play();
        });
    }
}
