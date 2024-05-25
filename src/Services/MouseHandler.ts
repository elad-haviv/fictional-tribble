import { Position, Rectangle } from "../types";

export default class MouseHandler {
    isDragging: boolean = false;
    draggingOffset: Position = { x: 0, y: 0 };
    mousePosition: Position = { x: 0, y: 0 };

    constructor() {
        this.isDragging = false;
        this.draggingOffset = { x: 0, y: 0 };
        this.mousePosition = { x: 0, y: 0 };
    }

    init() {
        window.addEventListener("mousedown", (event) => {
            this.isDragging = true;
            this.mousePosition = { x: event.clientX, y: event.clientY };
        });
        window.addEventListener("mousemove", (event) => {
            if (this.isDragging) {
                this.draggingOffset = {
                    x: event.clientX - this.mousePosition.x,
                    y: event.clientY - this.mousePosition.y,
                };
            }
            this.mousePosition = { x: event.clientX, y: event.clientY };
        });
        window.addEventListener("mouseup", () => {
            this.isDragging = false;
            this.draggingOffset = { x: 0, y: 0 };
        });
    }

    isWithinBounds(bounds: Rectangle) {
        return (
            this.mousePosition.x >= bounds.x &&
            this.mousePosition.x <= bounds.x + bounds.width &&
            this.mousePosition.y >= bounds.y &&
            this.mousePosition.y <= bounds.y + bounds.height
        );
    }

    isWithinBoundsWithOffset(bounds: Rectangle) {
        return (
            this.mousePosition.x + this.draggingOffset.x >= bounds.x &&
            this.mousePosition.x + this.draggingOffset.x <= bounds.x + bounds.width &&
            this.mousePosition.y + this.draggingOffset.y >= bounds.y &&
            this.mousePosition.y + this.draggingOffset.y <= bounds.y + bounds.height
        );
    }

    isClicking() {
        return this.isDragging && this.draggingOffset.x === 0 && this.draggingOffset.y === 0;
    }

    hasDragged() {
        return this.isDragging && (this.draggingOffset.x !== 0 || this.draggingOffset.y !== 0);
    }

    getMousePosition() {
        return this.mousePosition;
    }

    getDraggingOffset() {
        return this.draggingOffset;
    }

    isMouseDragging() {
        return this.isDragging;
    }
}
