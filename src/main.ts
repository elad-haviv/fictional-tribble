import "../style.css";
import App from "./App";
import NPC from "./npc";

const appContainer: HTMLCanvasElement =
    document.querySelector<HTMLCanvasElement>("#app")!;

const game = new App(appContainer);
game.components.push(new NPC(game));
game.start();