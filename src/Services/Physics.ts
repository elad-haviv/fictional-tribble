import App from "../App";
import Component from "../Components/Component";
import GameObject from "../Components/GameObject";
import { getOverlapVector, Polygon } from "../Geometry/Polygon";
import Vector from "../Math/Vector";

export default class PhysicsEngine extends Component {
    protected pixelsPerMeter: number = 1000;
    protected globalGravity: Vector;
    protected resitution: number = 0.5;
    protected objects: Set<GameObject> = new Set<GameObject>();

    constructor(app: App, gravity?: Vector) {
        super(app);
        this.globalGravity = gravity || new Vector(0, 9.81/this.pixelsPerMeter);
    }

    addObject(object: GameObject) {
        if (object.physics) {
            throw new Error("Object already part of a physics engine");
        }
        this.objects.add(object);
        object.physics = this;
    }

    removeObject(object: GameObject) {
        if (object.physics !== this) {
            throw new Error("Object not part of this physics engine");
        }
        object.physics = undefined;
        this.objects.delete(object);
    }

    update(deltaTime: number) {
        for (const object of this.objects) {
            // Apply gravity
            object.velocity.add(this.globalGravity);
        }

        // Collision detection and response
        this.objects.forEach((a) => {
            this.objects.forEach((b) => {
                if (a !== b) {
                    if (
                        PhysicsEngine.arePolygonsColliding(
                            a.getTransformedPolygon(),
                            b.getTransformedPolygon()
                        )
                    ) {
                        this.resolveCollision(a, b);
                    }
                }
            });
        });
    }

    resolveCollision(a: GameObject, b: GameObject) {
        const overlapVector = getOverlapVector(
            a.getTransformedPolygon(),
            b.getTransformedPolygon()
        );
        if (!a.isStatic) {
            a.position.subtract(overlapVector);
        }
        if (!b.isStatic) {
            b.position.add(overlapVector);
        }

        const normal = overlapVector.normalize();
        const relativeVelocity = a.velocity.clone().subtract(b.velocity);
        const velocityAlongNormal = relativeVelocity.clone().dot(normal);

        if (velocityAlongNormal > 0) {
            return;
        }

        const impulse = normal.scale(
            -(1 + this.resitution) * velocityAlongNormal
        );
        const totalInverseMass = 1 / a.mass + 1 / b.mass;
        const impulseScalar = impulse.dot(normal) / totalInverseMass;

        a.velocity.add(impulse.scale(1 / a.mass));
        b.velocity.subtract(impulse.scale(1 / b.mass));
    }

    static arePolygonsColliding(a: Polygon, b: Polygon) {
        const edges = a.getEdges().concat(b.getEdges());
        for (const edge of edges) {
            const axis = edge.perpendicular().normalize();
            const projection1 = a.project(axis);
            const projection2 = b.project(axis);
            if (
                projection1.min > projection2.max ||
                projection2.min > projection1.max
            ) {
                return false;
            }
        }
        return true;
    }

    static distanceBetweenPolygons(a: Polygon, b: Polygon) {
        let minDistance = Infinity;
        const edges = a.getEdges().concat(b.getEdges());
        for (const edge of edges) {
            const axis = edge.perpendicular().normalize();
            const projection1 = a.project(axis);
            const projection2 = b.project(axis);
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

    static distanceFromPolygonToPoint(polygon: Polygon, point: Vector) {
        let minDistance = Infinity;
        const edges = polygon.getEdges();
        for (const edge of edges) {
            const axis = edge.perpendicular().normalize();
            const projection = polygon.project(axis);
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

    init() {}
    render() {}
    destroy() {}
}
