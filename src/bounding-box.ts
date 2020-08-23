import { Point } from "./point";

export class BoundingBox {
    public readonly boundingBox: BoundingBoxDef;

    constructor () {
        this.boundingBox = {
            minX: +Infinity,
            minY: +Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
        };
    }

    static getBoundingBoxForPoint (point: Point) {
        const boundingBox = new BoundingBox();
        boundingBox.updateBoundingBoxForPoint(point);
        return boundingBox;
    }

    public getBoundingBoxArea(): number {
        const width: number = this.boundingBox.maxX - this.boundingBox.minX;
        const height: number = this.boundingBox.maxY - this.boundingBox.minY;
        const area = width * height;

        // area is Infinity for empty bounding boxes. This doesn't make sense
        // so reinterpret to 0
        if (area === Infinity) {
            return 0;
        }
        return area
    }

    public updateBoundingBoxForPoint (point: Point) {
        this.boundingBox.minX = Math.min(this.boundingBox.minX, point.x);
        this.boundingBox.minY = Math.min(this.boundingBox.minY, point.y);
        this.boundingBox.maxX = Math.max(this.boundingBox.maxX, point.x);
        this.boundingBox.maxY = Math.max(this.boundingBox.maxY, point.y);
    }

    public updateBoundingBoxForBoundingBox (boundingBox: BoundingBox) {
        this.boundingBox.minX = Math.min(this.boundingBox.minX, boundingBox.boundingBox.minX);
        this.boundingBox.minY = Math.min(this.boundingBox.minY, boundingBox.boundingBox.minY);
        this.boundingBox.maxX = Math.max(this.boundingBox.maxX, boundingBox.boundingBox.maxX);
        this.boundingBox.maxY = Math.max(this.boundingBox.maxY, boundingBox.boundingBox.maxY);
    }
}

interface BoundingBoxDef {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
