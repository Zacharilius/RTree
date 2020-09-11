import { expect } from 'chai'
import * as geojson from 'geojson';
import { BoundingBox } from '../src/bounding-box';

describe('BoundingBox test', () => {
    describe('constructor', () => {
        it('can create with constructor', () => {
            const boundingBox = new BoundingBox();
            expect(boundingBox).to.be.exist;
            expect(boundingBox.boundingBox).to.deep.equal({
                minX: +Infinity,
                minY: +Infinity,
                maxX: -Infinity,
                maxY: -Infinity,
            });
        });
        it('can create with getBoundingBoxForGeoJSONFeature constructor', () => {
            const x: number = 0;
            const y: number = 5;
            const point = getFeaturePoint(x, y);
            const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(point);
            expect(boundingBox.boundingBox).to.deep.equal({
                minX: x,
                minY: y,
                maxX: x,
                maxY: y,
            });
        });
    });

    describe('getBoundingBoxArea', () => {
        it('should calculate correctly on constructor init', () => {
            const boundingBox = new BoundingBox();
            expect(boundingBox.getBoundingBoxArea()).to.equal(0);
        });
        it('should calculate correctly on getBoundingBoxForGeoJSONFeature constructor init', () => {
            const point = getFeaturePoint(0, 5);
            const boundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(point);
            expect(boundingBox.getBoundingBoxArea()).to.equal(0);
        });
        it('should calculate correctly on for bounding box', () => {
            const point = getFeaturePoint(0, 5);
            const boundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(point);

            const point2 = getFeaturePoint(5, 10);
            boundingBox.extendBoundingBoxForGeoJSONFeature(point2)
            expect(boundingBox.getBoundingBoxArea()).to.equal(25);
        });
    });

    describe('isBoundingBoxInBoundingBox', () => {
        it('should return true if bounding box is entirely inside.', () => {
            const boundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(getFeaturePoint(0, 0));
            boundingBox.extendBoundingBoxForGeoJSONFeature(getFeaturePoint(100, 100));

            const targetBoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(getFeaturePoint(25, 25));
            targetBoundingBox.extendBoundingBoxForGeoJSONFeature(getFeaturePoint(50, 50));
            expect(boundingBox.isBoundingBoxInBoundingBox(targetBoundingBox)).to.be.true;
        });
        it('should return true if bounding box is partially inside.', () => {
            const boundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(getFeaturePoint(0, 0));
            boundingBox.extendBoundingBoxForGeoJSONFeature(getFeaturePoint(100, 100));

            const targetBoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(getFeaturePoint(75, 75));
            targetBoundingBox.extendBoundingBoxForGeoJSONFeature(getFeaturePoint(125, 125));
            expect(boundingBox.isBoundingBoxInBoundingBox(targetBoundingBox)).to.be.true;
        });
        it('should return false if bounding box is entire outside.', () => {
            const boundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(getFeaturePoint(0, 0));
            boundingBox.extendBoundingBoxForGeoJSONFeature(getFeaturePoint(100, 100));

            const targetBoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(getFeaturePoint(101, 101));
            targetBoundingBox.extendBoundingBoxForGeoJSONFeature(getFeaturePoint(125, 125));

            expect(boundingBox.isBoundingBoxInBoundingBox(targetBoundingBox)).to.be.false;
        });
    });

    describe('getBoundingBoxAreaIfExtended', () => {
        it('should calculate correctly if point is outside of the current bounding box', () => {
            const point = getFeaturePoint(0, 5);
            const boundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(point);
            const point2 = getFeaturePoint(50, 50);
            boundingBox.extendBoundingBoxForGeoJSONFeature(point2);

            const pointOutsideOtherBoundingBox = getFeaturePoint(55, 55);
            const boundingBox2 = BoundingBox.getBoundingBoxForGeoJSONFeature(pointOutsideOtherBoundingBox);

            expect(boundingBox.getBoundingBoxAreaIfExtended(boundingBox2)).to.equal(500);
        });
        it('should calculate correctly if point is inside of the current bounding box', () => {
            const point = getFeaturePoint(0, 5);
            const boundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(point);
            const point2 = getFeaturePoint(50, 50);
            boundingBox.extendBoundingBoxForGeoJSONFeature(point2);

            const pointOutsideOtherBoundingBox = getFeaturePoint(22, 22);
            const boundingBox2 = BoundingBox.getBoundingBoxForGeoJSONFeature(pointOutsideOtherBoundingBox);

            expect(boundingBox.getBoundingBoxAreaIfExtended(boundingBox2)).to.equal(0);
        });
    });

    describe('extendBoundingBoxForGeoJSONFeature', () => {
        let boundingBox: BoundingBox;
        beforeEach(() => {
            boundingBox = new BoundingBox();
        });
        describe('Point', () => {
            it('should update bounding box after init', () => {
                const point = getFeaturePoint(0, 5);
                boundingBox.extendBoundingBoxForGeoJSONFeature(point);
                expect(boundingBox.boundingBox.minX).to.equal(point.geometry.coordinates[0]);
                expect(boundingBox.boundingBox.minY).to.equal(point.geometry.coordinates[1]);
                expect(boundingBox.boundingBox.minX).to.equal(point.geometry.coordinates[0]);
                expect(boundingBox.boundingBox.maxY).to.equal(point.geometry.coordinates[1]);

            });
            it('should update minX and not maxX bounding box when new x is smaller', () => {
                const initPoint = getFeaturePoint(0, 5);
                boundingBox.extendBoundingBoxForGeoJSONFeature(initPoint);

                const pointWithSmallerX = getFeaturePoint(-1, 5);
                boundingBox.extendBoundingBoxForGeoJSONFeature(pointWithSmallerX);
                expect(boundingBox.boundingBox.minX).to.equal(pointWithSmallerX.geometry.coordinates[0]);
                expect(boundingBox.boundingBox.maxX).to.equal(initPoint.geometry.coordinates[0]);
            });
            it('should update maxX and not minX bounding box when new x is larger', () => {
                const initPoint = getFeaturePoint(0, 5);
                boundingBox.extendBoundingBoxForGeoJSONFeature(initPoint);

                const pointWithLargerX = getFeaturePoint(5, 5);
                boundingBox.extendBoundingBoxForGeoJSONFeature(pointWithLargerX);
                expect(boundingBox.boundingBox.minX).to.equal(initPoint.geometry.coordinates[0]);
                expect(boundingBox.boundingBox.maxX).to.equal(pointWithLargerX.geometry.coordinates[0]);
            });
            it('should update minY and not maxY bounding box when new y is smaller', () => {
                const initPoint = getFeaturePoint(0, 5);
                boundingBox.extendBoundingBoxForGeoJSONFeature(initPoint);

                const pointWithSmallerY = getFeaturePoint(0, 4);
                boundingBox.extendBoundingBoxForGeoJSONFeature(pointWithSmallerY);
                expect(boundingBox.boundingBox.minY).to.equal(pointWithSmallerY.geometry.coordinates[1]);
                expect(boundingBox.boundingBox.maxY).to.equal(initPoint.geometry.coordinates[1]);
            });
            it('should update maxY and not minY bounding box when new y is larger', () => {
                const initPoint = getFeaturePoint(0, 5);
                boundingBox.extendBoundingBoxForGeoJSONFeature(initPoint);

                const pointWithLargerY = getFeaturePoint(0, 6);
                boundingBox.extendBoundingBoxForGeoJSONFeature(pointWithLargerY);
                expect(boundingBox.boundingBox.minY).to.equal(initPoint.geometry.coordinates[1]);
                expect(boundingBox.boundingBox.maxY).to.equal(pointWithLargerY.geometry.coordinates[1]);
            });
        });
        describe('MultiPoint', () => {
            it('should update bounding box after init', () => {
                const minX: number = 0;
                const minY: number = 10;
                const maxX: number = 55;
                const maxY: number = 22;
                const multiPoint: geojson.Feature<geojson.MultiPoint> = {
                    type: "Feature",
                    geometry: {
                        type: "MultiPoint",
                        coordinates: [
                            [minX, minY],
                            [maxX, maxY]
                        ]
                    },
                    properties: {}
                };
                boundingBox.extendBoundingBoxForGeoJSONFeature(multiPoint);
                expect(boundingBox.boundingBox.minX).to.equal(minX);
                expect(boundingBox.boundingBox.minY).to.equal(minY);
                expect(boundingBox.boundingBox.maxX).to.equal(maxX);
                expect(boundingBox.boundingBox.maxY).to.equal(maxY);
            });
        });
        describe('LineString', () => {
            it('should update bounding box after init', () => {
                const minX: number = 0;
                const minY: number = 10;
                const maxX: number = 55;
                const maxY: number = 22;
                const multiPoint: geojson.Feature<geojson.LineString> = {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: [
                            [minX, minY],
                            [maxX, maxY]
                        ]
                    },
                    properties: {}
                };
                boundingBox.extendBoundingBoxForGeoJSONFeature(multiPoint);
                expect(boundingBox.boundingBox.minX).to.equal(minX);
                expect(boundingBox.boundingBox.minY).to.equal(minY);
                expect(boundingBox.boundingBox.maxX).to.equal(maxX);
                expect(boundingBox.boundingBox.maxY).to.equal(maxY);
            });
        });
        describe('MultiLineString', () => {
            it('should update bounding box after init', () => {
                const minX: number = 0;
                const minY: number = 10;
                const maxX: number = 55;
                const maxY: number = 22;
                const multiPoint: geojson.Feature<geojson.MultiLineString> = {
                    type: "Feature",
                    geometry: {
                        type: "MultiLineString",
                        coordinates: [
                            [
                                [minX, minY],
                                [maxX, maxY]
                            ]
                        ]
                    },
                    properties: {}
                };
                boundingBox.extendBoundingBoxForGeoJSONFeature(multiPoint);
                expect(boundingBox.boundingBox.minX).to.equal(minX);
                expect(boundingBox.boundingBox.minY).to.equal(minY);
                expect(boundingBox.boundingBox.maxX).to.equal(maxX);
                expect(boundingBox.boundingBox.maxY).to.equal(maxY);
            });
        });
        describe('Polygon', () => {
            it('should update bounding box after init', () => {
                const minX: number = 0;
                const minY: number = 10;
                const maxX: number = 55;
                const maxY: number = 22;
                const multiPoint: geojson.Feature<geojson.Polygon> = {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [minX, minY],
                                [maxX, maxY]
                            ]
                        ]
                    },
                    properties: {}
                };
                boundingBox.extendBoundingBoxForGeoJSONFeature(multiPoint);
                expect(boundingBox.boundingBox.minX).to.equal(minX);
                expect(boundingBox.boundingBox.minY).to.equal(minY);
                expect(boundingBox.boundingBox.maxX).to.equal(maxX);
                expect(boundingBox.boundingBox.maxY).to.equal(maxY);
            });
        });
        describe('MultiPolygon', () => {
            it('should update bounding box after init', () => {
                const minX: number = 0;
                const minY: number = 10;
                const maxX: number = 55;
                const maxY: number = 22;
                const multiPoint: geojson.Feature<geojson.MultiPolygon> = {
                    type: "Feature",
                    geometry: {
                        type: "MultiPolygon",
                        coordinates: [
                            [
                                [
                                    [minX, minY],
                                    [maxX, maxY]
                                ]
                            ]
                        ]
                    },
                    properties: {}
                };
                boundingBox.extendBoundingBoxForGeoJSONFeature(multiPoint);
                expect(boundingBox.boundingBox.minX).to.equal(minX);
                expect(boundingBox.boundingBox.minY).to.equal(minY);
                expect(boundingBox.boundingBox.maxX).to.equal(maxX);
                expect(boundingBox.boundingBox.maxY).to.equal(maxY);
            });
        });
    });
    describe('extendBoundingBoxForBoundingBox', () => {
        let boundingBox: BoundingBox;
        beforeEach(() => {
            boundingBox = new BoundingBox();
        });
        it('should update minX and not maxX bounding box when new x is smaller', () => {
            const initPoint = getFeaturePoint(0, 5);
            const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(initPoint);

            const pointWithSmallerX = getFeaturePoint(-5, 5);
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(pointWithSmallerX);
            boundingBox.extendBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minX).to.equal(pointWithSmallerX.geometry.coordinates[0]);
            expect(boundingBox.boundingBox.maxX).to.equal(initPoint.geometry.coordinates[0]);
        });
        it('should update maxX and not minX bounding box when new x is larger', () => {
            const initPoint = getFeaturePoint(0, 5);
            boundingBox.extendBoundingBoxForGeoJSONFeature(initPoint);

            const pointWithLargerX = getFeaturePoint(5, 5);
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(pointWithLargerX);
            boundingBox.extendBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minX).to.equal(initPoint.geometry.coordinates[0]);
            expect(boundingBox.boundingBox.maxX).to.equal(pointWithLargerX.geometry.coordinates[0]);
        });
        it('should update minY and not maxY bounding box when new y is smaller', () => {
            const initPoint = getFeaturePoint(0, 5);
            boundingBox.extendBoundingBoxForGeoJSONFeature(initPoint);

            const pointWithSmallerY = getFeaturePoint(0, 4);
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(pointWithSmallerY);
            boundingBox.extendBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minY).to.equal(pointWithSmallerY.geometry.coordinates[1]);
            expect(boundingBox.boundingBox.maxY).to.equal(initPoint.geometry.coordinates[1]);
        });
        it('should update maxY and not minY bounding box when new y is larger', () => {
            const x = 0;
            const y = 5;
            const initPoint = getFeaturePoint(0, 5);
            boundingBox.extendBoundingBoxForGeoJSONFeature(initPoint);

            const pointWithLargerY = getFeaturePoint(0, 6);
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(pointWithLargerY);
            boundingBox.extendBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minY).to.equal(initPoint.geometry.coordinates[1]);
            expect(boundingBox.boundingBox.maxY).to.equal(pointWithLargerY.geometry.coordinates[1]);
        });
    });
});

const getFeaturePoint = (x: number, y: number): geojson.Feature<geojson.Point> => {
    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [x, y]
        },
        properties: {}
    };
}
