import App from "../App";
import { Polygon } from "../Geometry/Polygon";
import Color from "../Math/Color";
import Vector from "../Math/Vector";
import GameObject from "./GameObject";

export default class VisiblePolygon extends GameObject {
    public color: Color;
    public lineWidth: number;

    constructor(app: App, position: Vector, polygon: Polygon, color: Color, lineWidth: number = 1) {
        super(app, position, polygon);
        this.color = color;
        this.lineWidth = lineWidth;
    }

    public render() {
        super.render();

        this.app.context.save();
        this.app.context.strokeStyle = this.color.toHex();
        this.app.context.lineWidth = this.lineWidth;

        this.app.context.beginPath();
        const vertices = this.getTransformedPolygon().getVertices();
        this.app.context.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            this.app.context.lineTo(vertices[i].x, vertices[i].y);
        }
        this.app.context.closePath();
        this.app.context.stroke();

        this.app.context.restore();
    }
}