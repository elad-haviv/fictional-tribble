import Component from "./Component";
import App from "./App";

export default class NPC extends Component {
    x: number = 100;
    y: number = 100;

    size: number = 20;

    speedx: number = 3;
    speedy: number = 3;
    
    constructor(game: App) {
        super(game);
    }

    init() {
        throw new Error("Method not implemented.");
    }

    update(deltaTime: number) {
        if (this.app.canvas.width < this.x || this.x < 0) {
            this.speedx *= -1;
        }

        if (this.app.canvas.height < this.y || this.y < 0) {
            this.speedy *= -1;
        }
        
        this.x += this.speedx;
        this.y += this.speedy;
    }

    render() {
        this.app.context.fillRect(this.x-this.size/2, this.y-this.size/2, this.size/2, this.size/2);
    }

    destroy() {
        throw new Error("Method not implemented.");
    }
}   