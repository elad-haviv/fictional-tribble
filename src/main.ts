import "../style.css";
import App from "./App";
import VisiblePolygon from "./Components/VisiblePolygon";
import { Polygon } from "./Geometry/Polygon";
import { Green, Red } from "./Math/Color";

import Vector from "./Math/Vector";
import PhysicsEngine from "./Services/Physics";

const appContainer: HTMLCanvasElement =
    document.querySelector<HTMLCanvasElement>("#app")!;

const game = new App(appContainer);
const physics = new PhysicsEngine(game);

const poly1 = new VisiblePolygon(
    game,
    new Vector(200, 200),
    new Polygon([
        new Vector(0, 0),
        new Vector(150, 0),
        new Vector(200, 50),
        new Vector(80, 100),
        new Vector(20, 100),
    ]),
    Red
);

const platform = new VisiblePolygon(
    game,
    new Vector(0, 600),
    new Polygon([
        new Vector(0, 0),
        new Vector(800, 0),
        new Vector(800, 20),
        new Vector(0, 20),
    ]),
    Green
);

platform.isStatic = true;

physics.addObject(poly1);
physics.addObject(platform);
poly1.angularVelocity = 0.01;

poly1.addEventListener("render", () => {
    // draw a blue circle at the center of the polygon
    game.context.beginPath();
    game.context.arc(poly1.position.x, poly1.position.y, 5, 0, 2 * Math.PI);
    game.context.fillStyle = "blue";
    game.context.fill();
    game.context.closePath();
});

game.start();
