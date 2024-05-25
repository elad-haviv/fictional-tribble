export default class Vector {
    x: number;
    y: number;

    get angle() {
        return Math.atan2(this.y, this.x);
    }

    set angle(angle: number) {
        const magnitude = this.magnitude;
        this.x = Math.cos(angle) * magnitude;
        this.y = Math.sin(angle) * magnitude;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set magnitude(magnitude: number) {
        const angle = this.angle;
        this.x = Math.cos(angle) * magnitude;
        this.y = Math.sin(angle) * magnitude;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static createPolar(radius: number, angle: number): Vector {
        return new Vector(radius * Math.cos(angle), radius * Math.sin(angle));
    }

    static create(x: number, y: number): Vector {
        return new Vector(x, y);
    }

    add(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    static add(a: Vector, b: Vector) {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    subtract(vector: Vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    static subtract(a: Vector, b: Vector) {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    scale(scalar: number) {
        this.magnitude *= scalar;
        return this;
    }

    static scale(vector: Vector, scalar: number) {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }

    rotate(angle: number) {
        this.angle += angle;
        return this;
    }

    static rotate(vector: Vector, angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector(
            vector.x * cos - vector.y * sin,
            vector.x * sin + vector.y * cos
        );
    }

    dot(vector: Vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    static dot(a: Vector, b: Vector) {
        return a.x * b.x + a.y * b.y;
    }

    cross(vector: Vector) {
        return this.x * vector.y - this.y * vector.x;
    }

    static cross(a: Vector, b: Vector) {
        return a.x * b.y - a.y * b.x;
    }

    perpendicular() {
        return new Vector(-this.y, this.x);
    }

    normalize() {
        this.magnitude = 1;
        return this;
    }

    static normalize(vector: Vector): Vector {
        return new Vector(vector.x, vector.y).normalize();
    }

    limit(max: number) {
        return this.magnitude > max ? this.normalize().scale(max) : this;
    }

    distance(vector: Vector) {
        return new Vector(this.x - vector.x, this.y - vector.y).magnitude;
    }

    static distance(a: Vector, b: Vector) {
        return new Vector(a.x - b.x, a.y - b.y).magnitude;
    }

    equals(vector: Vector) {
        return this.x === vector.x && this.y === vector.y;
    }

    static get zero() {
        return new Vector(0, 0);
    }

    static get one() {
        return new Vector(1, 1);
    }

    static get up() {
        return new Vector(0, -1);
    }

    static get down() {
        return new Vector(0, 1);
    }

    static get left() {
        return new Vector(-1, 0);
    }

    static get right() {
        return new Vector(1, 0);
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    static fromAngle(angle: number) {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
}
