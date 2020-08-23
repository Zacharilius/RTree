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
        return this.calculateBoundingBoxArea(this.boundingBox);
    }

    private calculateBoundingBoxArea(boundingBox: BoundingBoxDef): number {
        const width: number = boundingBox.maxX - boundingBox.minX;
        const height: number = boundingBox.maxY - boundingBox.minY;
        const area = width * height;

        // area is Infinity for empty bounding boxes. This doesn't make sense
        // so reinterpret to 0
        if (area === Infinity) {
            return 0;
        }
        return area
    }

    public getBoundingBoxAreaIfAddBoundingBox(boundingBox: BoundingBox): number {
        const newBoundingBoxAfterMerge = this.mergeBoundingBoxes(this.boundingBox, boundingBox.boundingBox);
        const areaAfter = this.calculateBoundingBoxArea(newBoundingBoxAfterMerge);
        return areaAfter;
    }

    public updateBoundingBoxForPoint (point: Point): void {
        this.boundingBox.minX = Math.min(this.boundingBox.minX, point.x);
        this.boundingBox.minY = Math.min(this.boundingBox.minY, point.y);
        this.boundingBox.maxX = Math.max(this.boundingBox.maxX, point.x);
        this.boundingBox.maxY = Math.max(this.boundingBox.maxY, point.y);
    }

    public updateBoundingBoxForBoundingBox (boundingBox: BoundingBox): void {
        const mergeBoundingBox = this.mergeBoundingBoxes(this.boundingBox, boundingBox.boundingBox);
        this.boundingBox.minX = mergeBoundingBox.minX;
        this.boundingBox.minY = mergeBoundingBox.minY;
        this.boundingBox.maxX = mergeBoundingBox.maxX;
        this.boundingBox.maxY = mergeBoundingBox.maxY;
    }

    private mergeBoundingBoxes (boundingBoxDef1: BoundingBoxDef, boundingBoxDef2: BoundingBoxDef): BoundingBoxDef {
        return {
            minX: Math.min(boundingBoxDef1.minX, boundingBoxDef2.minX),
            minY: Math.min(boundingBoxDef1.minY, boundingBoxDef2.minY),
            maxX: Math.max(boundingBoxDef1.maxX, boundingBoxDef2.maxX),
            maxY: Math.max(boundingBoxDef1.maxY, boundingBoxDef2.maxY),
        } as BoundingBoxDef
    }
}

interface BoundingBoxDef {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
