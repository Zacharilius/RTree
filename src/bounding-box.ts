import * as geojson from 'geojson';
import { Point } from './point';

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

    // TODO: Remove
    static getBoundingBoxForPoint (point: Point) {
        const boundingBox = new BoundingBox();
        boundingBox.extendBoundingBoxForPoint(point);
        return boundingBox;
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

    // TODO: Remove
    public extendBoundingBoxForPoint (point: Point): void {
        this.boundingBox.minX = Math.min(this.boundingBox.minX, point.x);
        this.boundingBox.minY = Math.min(this.boundingBox.minY, point.y);
        this.boundingBox.maxX = Math.max(this.boundingBox.maxX, point.x);
        this.boundingBox.maxY = Math.max(this.boundingBox.maxY, point.y);
    }

    public extendBoundingBoxForGeoJSONFeature (feature: geojson.Feature) {
        // Set geometry to "any" type so that I can set the correct type after
        // processing the geojson feature.
        let geometry: any = feature.geometry;
        let minX: number;
        let minY: number;
        let maxX: number;
        let maxY: number;
        // if (geometry.type === 'Point') {
            geometry = geometry as geojson.Point;
            minX = geometry.coordinates[0];
            minY = geometry.coordinates[1];
            maxX = geometry.coordinates[0];
            maxY = geometry.coordinates[1];

        // } else if (geometry.type === 'MultiPoint') {
        //     geometry = <GeoJSON.MultiPoint>geometry;
        //     // coordinates: Position[];
        // } else if (geometry.type === 'LineString') {
        //     geometry = <GeoJSON.LineString>geometry;
        //     // coordinates: Position[];
        // } else if (geometry.type === 'MultiLineString') {
        //     geometry = <GeoJSON.MultiLineString>geometry;
        //     // coordinates: Position[][];
        // } else if (geometry.type === 'Polygon') {
        //     geometry = <GeoJSON.Polygon>geometry;
        //     // coordinates: Position[][];

        // } else if (geometry.type === 'MultiPolygon') {
        //     geometry = <GeoJSON.MultiPolygon>geometry;
        //     // coordinates: Position[][][];

        // }

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
