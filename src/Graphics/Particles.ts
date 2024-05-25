import Color, { Black } from "../Math/Color";
import Vector from "../Math/Vector";

export class Particle {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    lifetime: number;
    age: number;
    color: Color;
    scale: Vector;

    constructor(position: Vector, velocity: Vector, acceleration: Vector, lifetime: number, color: Color = Black, scale: Vector = Vector.one) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.lifetime = lifetime;
        this.age = 0;

        this.color = color;
        this.scale = scale;
    }

    update(deltaTime: number) {
        this.velocity.add(this.acceleration.clone().scale(deltaTime));
        this.position.add(this.velocity.clone().scale(deltaTime));
        this.age += deltaTime;
    }

    isAlive(): boolean {
        return this.age < this.lifetime;
    }

    render(context: CanvasRenderingContext2D) {
        const alpha = 1 - this.age / this.lifetime;
        context.fillStyle = this.color.fade(alpha).toString();
        context.fillRect(this.position.x, this.position.y, this.scale.x, this.scale.y);
    }
}

export class ImageParticle extends Particle {
    image: CanvasImageSource;

    constructor(position: Vector, velocity: Vector, acceleration: Vector, lifetime: number, image: CanvasImageSource, scale: Vector = Vector.one) {
        super(position, velocity, acceleration, lifetime, Black, scale);
        this.image = image;
    }

    render(context: CanvasRenderingContext2D) {
        const alpha = 1 - this.age / this.lifetime;
        context.globalAlpha = alpha;
        context.drawImage(this.image, this.position.x, this.position.y, this.scale.x, this.scale.y);
        context.globalAlpha = 1;
    }
}

export class Emitter {
    position: Vector;
    particles: Array<Particle> = [];
    emitRate: number;
    emitTime: number;
    emitDelay: number;
    emitCount: number;
    isEmitting: boolean;
    
    particleLifetime: number;
    particleVelocity: Vector;
    particleAcceleration: Vector;
    particleColor: Color;
    particleScale: Vector;

    constructor(position: Vector, emitRate: number, emitDelay: number, particleLifetime: number, particleVelocity: Vector, particleAcceleration: Vector, particleColor: Color, particleScale: Vector) {
        this.position = position;
        this.emitRate = emitRate;
        this.emitTime = 0;
        this.emitDelay = emitDelay;
        this.emitCount = 0;
        this.isEmitting = true;

        this.particleLifetime = particleLifetime;
        this.particleVelocity = particleVelocity;
        this.particleAcceleration = particleAcceleration;
        this.particleColor = particleColor;
        this.particleScale = particleScale;
    }

    update(deltaTime: number) {
        if (this.isEmitting) {
            this.emitTime += deltaTime;
            if (this.emitTime >= this.emitDelay) {
                this.emitTime = 0;
                this.emitCount++;
                this.particles.push(new Particle(this.position.clone(), this.particleVelocity.clone(), this.particleAcceleration.clone(), this.particleLifetime, this.particleColor, this.particleScale));
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            if (!particle.isAlive()) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(context: CanvasRenderingContext2D) {
        for (const particle of this.particles) {
            particle.render(context);
        }
    }

    stop() {
        this.isEmitting = false;
    }

    reset() {
        this.emitTime = 0;
        this.emitCount = 0;
        this.isEmitting = true;
        this.particles = [];
    }

    isDone(): boolean {
        return !this.isEmitting && this.particles.length === 0;
    }

    isEmittingDone(): boolean {
        return !this.isEmitting && this.emitCount >= this.emitRate;
    }
}