import * as geojson from 'geojson';

interface BoundingBoxDef {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export class BoundingBox {
    public readonly boundingBox: BoundingBoxDef;

    constructor (minX=+Infinity, minY=+Infinity, maxX=-Infinity, maxY=-Infinity) {
        this.boundingBox = {
            minX,
            minY,
            maxX,
            maxY,
        };
    }

    static getBoundingBoxForGeoJSONFeature (geoJSONFeature: geojson.Feature<geojson.GeometryObject>) {
        const boundingBox = new BoundingBox();
        boundingBox.extendBoundingBoxForGeoJSONFeature(geoJSONFeature);
        return boundingBox;
    }

    static getBoundingBoxForBoundingBoxValues(minX: number, minY: number, maxX: number, maxY: number) {
        const boundingBox = new BoundingBox();
        boundingBox.boundingBox.minX = minX;
        boundingBox.boundingBox.minY = minY;
        boundingBox.boundingBox.maxX = maxX;
        boundingBox.boundingBox.maxY = maxY;
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

    public getBoundingBoxAreaIfExtended(boundingBox: BoundingBox): number {
        const beforeArea = this.getBoundingBoxArea();
        const newBoundingBoxAfterMerge = this.mergeBoundingBoxes(this.boundingBox, boundingBox.boundingBox);
        const areaAfter = this.calculateBoundingBoxArea(newBoundingBoxAfterMerge);
        return areaAfter - beforeArea;
    }

    // Determines if the target bounding box is inside this bounding box.
    public isBoundingBoxInBoundingBox (targetBoundingBox: BoundingBox) {
        return (
            (
                targetBoundingBox.boundingBox.maxX >= this.boundingBox.minX &&
                targetBoundingBox.boundingBox.minX <= this.boundingBox.maxX
            )
            &&
            (
                targetBoundingBox.boundingBox.maxY >= this.boundingBox.minY &&
                targetBoundingBox.boundingBox.minY <= this.boundingBox.maxY
            )
        )
    }

    public extendBoundingBoxForGeoJSONFeature (feature: geojson.Feature): void {
        // Set geometry to "any" type so that I can set the correct type after
        // processing the geojson feature.
        let geometry: any = feature.geometry;
        let minX: number;
        let minY: number;
        let maxX: number;
        let maxY: number;

        // MultiPolygon requires 4 flattens.
        const MAX_FLATTENS = 4;
        let flattenedCoordinates: Array<number> = geometry.coordinates.flat(MAX_FLATTENS);

        const xCoordinates: Array<number> = []
        const yCoordinates: Array<number> = []
        flattenedCoordinates.forEach((coordinate, index) => {
            if (index % 2 === 0) {
                xCoordinates.push(coordinate);
            } else {
                yCoordinates.push(coordinate);
            }
        });

        minX = xCoordinates.reduce((a: number, b: number) => {
            return Math.min(a, b);
        });
        minY = yCoordinates.reduce((a: number, b: number) => {
            return Math.min(a, b);
        });
        maxX = xCoordinates.reduce((a: number, b: number) => {
            return Math.max(a, b);
        });
        maxY = yCoordinates.reduce((a: number, b: number) => {
            return Math.max(a, b);
        });
        const boundingBox = new BoundingBox(minX, minY, maxX, maxY);
        this.extendBoundingBoxForBoundingBox(boundingBox);
    }

    public extendBoundingBoxForBoundingBox (boundingBox: BoundingBox): void {
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

