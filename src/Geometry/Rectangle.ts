import Vector from "../Math/Vector";
import { Polygon, arePolygonsColliding } from "./Polygon";

export default class Rectangle extends Polygon {

    constructor(x: number, y: number, width: number, height: number) {
        super([
            new Vector(x, y),
            new Vector(x + width, y),
            new Vector(x + width, y + height),
            new Vector(x, y + height),
        ]);
    }

    getTopLeft() {
        return this.vertices[0];
    }

    getTopRight() {
        return this.vertices[1];
    }

    getBottomRight() {
        return this.vertices[2];
    }

    getBottomLeft() {
        return this.vertices[3];
    }

    getWidth() {
        return this.vertices[1].x - this.vertices[0].x;
    }

    getHeight() {
        return this.vertices[3].y - this.vertices[0].y;
    }

    toPolygon() {
        return new Polygon(this.vertices);
    }

    isCollidingWith(polygon: Polygon) {
        return arePolygonsColliding(this, polygon);
    }

    isPointInside(point: Vector) {
        const edges = this.getEdges();
        for (const edge of edges) {
            const axis = edge.perpendicular().normalize();
            const projection = this.project(axis);
            const pointProjection = axis.dot(point);
            if (
                pointProjection < projection.min ||
                pointProjection > projection.max
            ) {
                return false;
            }
        }
        return true;
    }

    project(axis: Vector) {
        let min = axis.dot(this.vertices[0]);
        let max = min;
        for (const vertex of this.vertices) {
            const projection = axis.dot(vertex);
            if (projection < min) {
                min = projection;
            } else if (projection > max) {
                max = projection;
            }
        }
        return { min, max };
    }
}
