import Vector from "../Math/Vector";

export default class Circle {
    position: Vector;
    radius: number;

    constructor(x: number, y: number, radius: number) {
        this.position = new Vector(x, y);
        this.radius = radius;
    }

    isCollidingWith(circle: Circle) {
        return this.position.distance(circle.position) < this.radius + circle.radius;
    }

    isPointInside(point: Vector) {
        return this.position.distance(point) < this.radius;
    }

    project(axis: Vector) {
        const centerProjection = axis.dot(this.position);
        return {
            min: centerProjection - this.radius,
            max: centerProjection + this.radius
        };
    }
}