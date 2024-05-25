import Vector from "../Math/Vector";

export class Polygon {
    protected vertices: Vector[];

    constructor(vertices: Vector[]) {
        this.vertices = vertices;
    }

    clone(): Polygon {
        return new Polygon(this.vertices.map((vertex) => vertex.clone()));
    }

    public getVertices(): Vector[] {
        return this.vertices;
    }

    public getEdges(): Vector[] {
        const edges: Vector[] = [];
        for (let i = 0; i < this.vertices.length; i++) {
            const nextIndex = (i + 1) % this.vertices.length;
            const edge = Vector.subtract(
                this.vertices[nextIndex],
                this.vertices[i]
            );
            edges.push(edge);
        }
        return edges;
    }

    public getCenter(): Vector {
        let x = 0;
        let y = 0;
        for (const vertex of this.vertices) {
            x += vertex.x;
            y += vertex.y;
        }
        return new Vector(x / this.vertices.length, y / this.vertices.length);
    }

    getPosition(): Vector {
        return this.getCenter();
    }

    setPosition(position: Vector) {
        const center = this.getCenter();
        this.move(Vector.subtract(position, center));
    }

    getTop(): number {
        return Math.min(...this.vertices.map((vertex) => vertex.y));
    }

    setTop(top: number) {
        const currentTop = this.getTop();
        this.move(new Vector(0, top - currentTop));
    }

    getRight(): number {
        return Math.max(...this.vertices.map((vertex) => vertex.x));
    }

    setRight(right: number) {
        const currentRight = this.getRight();
        this.move(new Vector(right - currentRight, 0));
    }

    getBottom(): number {
        return Math.max(...this.vertices.map((vertex) => vertex.y));
    }

    setBottom(bottom: number) {
        const currentBottom = this.getBottom();
        this.move(new Vector(0, bottom - currentBottom));
    }

    getLeft(): number {
        return Math.min(...this.vertices.map((vertex) => vertex.x));
    }

    setLeft(left: number) {
        const currentLeft = this.getLeft();
        this.move(new Vector(left - currentLeft, 0));
    }

    getWidth(): number {
        return this.getRight() - this.getLeft();
    }

    getHeight(): number {
        return this.getBottom() - this.getTop();
    }

    getArea(): number {
        let area = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex1 = this.vertices[i];
            const vertex2 = this.vertices[(i + 1) % this.vertices.length];
            area += vertex1.x * vertex2.y - vertex1.y * vertex2.x;
        }
        return Math.abs(area / 2);
    }

    getPerimeter(): number {
        let perimeter = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex1 = this.vertices[i];
            const vertex2 = this.vertices[(i + 1) % this.vertices.length];
            perimeter += vertex1.distance(vertex2);
        }
        return perimeter;
    }

    public move(vector: Vector): void {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].add(vector);
        }
    }

    public rotate(angle: number, center?: Vector): void {
        if (!center) center = this.getCenter();
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].subtract(center).rotate(angle).add(center);
        }
    }

    public scale(scale: number, center?: Vector): void {
        if (!center) center = this.getCenter();
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].subtract(center).scale(scale).add(center);
        }
    }

    public project(axis: Vector): { min: number; max: number } {
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

    isCollidingWith(polygon: Polygon): boolean {
        return arePolygonsColliding(this, polygon);
    }

    isPointInside(point: Vector): boolean {
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

    distanceTo(polygon: Polygon): number {
        let minDistance = Infinity;
        const edges = this.getEdges().concat(polygon.getEdges());
        for (const edge of edges) {
            const axis = edge.perpendicular().normalize();
            const projection1 = this.project(axis);
            const projection2 = polygon.project(axis);
            const distance = Math.max(
                projection1.min - projection2.max,
                projection2.min - projection1.max
            );
            if (distance >= 0) {
                return 0;
            }
            minDistance = Math.min(minDistance, -distance);
        }
        return minDistance;
    }

    distanceToPoint(point: Vector): number {
        let minDistance = Infinity;
        const edges = this.getEdges();
        for (const edge of edges) {
            const axis = edge.perpendicular().normalize();
            const projection = this.project(axis);
            const pointProjection = axis.dot(point);
            const distance = Math.max(
                projection.min - pointProjection,
                pointProjection - projection.max
            );
            if (distance >= 0) {
                return 0;
            }
            minDistance = Math.min(minDistance, -distance);
        }
        return minDistance;
    }
}

export function getOverlapVector(a: Polygon, b: Polygon): Vector {
    let overlap: number | null = null;
    let smallestAxis: Vector | null = null;

    const polygons = [a, b];
    for (const polygon of polygons) {
        const edges = polygon.getEdges();
        for (const edge of edges) {
            const axis = edge.perpendicular().normalize();
            const projection1 = a.project(axis);
            const projection2 = b.project(axis);

            const overlapAmount =
                Math.min(projection1.max, projection2.max) -
                Math.max(projection1.min, projection2.min);
            if (overlapAmount < 0) {
                return Vector.zero; // No overlap
            } else if (overlap === null || overlapAmount < overlap) {
                overlap = overlapAmount;
                smallestAxis = axis;
            }
        }
    }

    if (smallestAxis && overlap !== null) {
        return smallestAxis.scale(overlap);
    }
    return Vector.zero;
}

export function arePolygonsColliding(
    polygon1: Polygon,
    polygon2: Polygon
): boolean {
    const polygons = [polygon1, polygon2];
    for (const polygon of polygons) {
        const edges = polygon.getEdges();
        for (const edge of edges) {
            const axis = edge.perpendicular().normalize();
            const projection1 = polygon1.project(axis);
            const projection2 = polygon2.project(axis);

            if (
                projection1.max < projection2.min ||
                projection2.max < projection1.min
            ) {
                return false;
            }
        }
    }
    return true;
}
