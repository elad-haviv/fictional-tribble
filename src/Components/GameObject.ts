import App from "../App";
import { Polygon } from "../Geometry/Polygon";
import Vector from "../Math/Vector";
import PhysicsEngine from "../Services/Physics";
import Component from "./Component";

export default class GameObject extends Component {
    public physics?: PhysicsEngine;

    public isStatic: boolean;
    public mass: number = 1;
    public bounciness: number = 0.5;
    public friction: number = 0.1;

    public position: Vector;
    public velocity: Vector;
    public acceleration: Vector;

    public rotation: number;
    public angularVelocity: number;
    public angularAcceleration: number;
    
    public size: number;

    public polygon: Polygon;

    constructor(
        app: App,
        position: Vector,
        polygon?: Polygon,
        isStatic: boolean = false
    ) {
        super(app);
        this.position = position;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        this.rotation = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;

        this.size = 1;

        this.polygon = polygon || new Polygon([position]);
        this.isStatic = isStatic;
    }

    init(): void {
        super.init();
    }

    update(deltaTime: number): void {
        super.update(deltaTime);

        this.move(deltaTime);
        this.rotate(deltaTime);
    }

    render(): void {
        super.render();
    }

    destroy(): void {
        super.destroy();
    }

    public getTransformedPolygon(): Polygon {
        const transformedPolygon = this.polygon.clone();
        transformedPolygon.setPosition(this.position);
        transformedPolygon.rotate(this.rotation);
        transformedPolygon.scale(this.size);
        return transformedPolygon;
    }

    public move(deltaTime: number) {
        if (!this.isStatic) {
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
        }
    }

    public setPosition(position: Vector) {
        this.position = position;
    }

    public rotate(deltaTime: number) {
        if (!this.isStatic) {
            this.angularVelocity += this.angularAcceleration;
            this.rotation += this.angularVelocity;
        }
    }

    public setRotation(rotation: number) {
        this.rotation = rotation;
    }

    public scale(scale: number) {
        this.size *= scale;
    }

    public setScale(scale: number) {
        this.size = scale;
    }

    public applyForce(force: Vector) {
        this.acceleration = this.acceleration.add(force);
    }

    public applyTorque(torque: number) {
        this.angularAcceleration += torque;
    }

    public applyFriction(friction: number) {
        const frictionForce = this.velocity
            .scale(-1)
            .normalize()
            .scale(friction);
        this.applyForce(frictionForce);
    }

    public applyInertia(inertia: number) {
        this.angularVelocity *= inertia;
    }

    public applyGravity(gravity: number) {
        this.applyForce(new Vector(0, gravity));
    }

    public applyDrag(drag: number) {
        const dragForce = this.velocity.scale(-1).normalize().scale(drag);
        this.applyForce(dragForce);
    }

    public applyImpulse(impulse: Vector) {
        this.velocity = this.velocity.add(impulse);
    }

    public applyAngularImpulse(impulse: number) {
        this.angularVelocity += impulse;
    }
}
