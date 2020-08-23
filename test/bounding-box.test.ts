import { expect } from 'chai'

import { BoundingBox } from '../src/bounding-box';
import { Point } from '../src/point';

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
        it('can create with getBoundingBoxForPoint constructor', () => {
            const point: Point = {
                x: 0,
                y: 5
            };
            const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForPoint(point);
            expect(boundingBox.boundingBox).to.deep.equal({
                minX: point.x,
                minY: point.y,
                maxX: point.x,
                maxY: point.y,
            });
        });
    });

    describe('getBoundingBoxArea', () => {
        it('should calculate correctly on constructor init', () => {
            const boundingBox = new BoundingBox();
            expect(boundingBox.getBoundingBoxArea()).to.equal(0);
        });
        it('should calculate correctly on getBoundingBoxForPoint constructor init', () => {
            const point: Point = {
                x: 0,
                y: 5
            };
            const boundingBox = BoundingBox.getBoundingBoxForPoint(point);
            expect(boundingBox.getBoundingBoxArea()).to.equal(0);
        });
        it('should calculate correctly on for bounding box', () => {
            const point: Point = {
                x: 0,
                y: 5
            };
            const boundingBox = BoundingBox.getBoundingBoxForPoint(point);

            const point2: Point = {
                x: 5,
                y: 10
            };
            boundingBox.updateBoundingBoxForPoint(point2)
            expect(boundingBox.getBoundingBoxArea()).to.equal(25);
        });
    });

    describe('getBoundingBoxAreaIfAddBoundingBox', () => {
        it('should calculate correctly if point is outside of the current bounding box', () => {
            const point: Point = {
                x: 0,
                y: 5
            };
            const boundingBox = BoundingBox.getBoundingBoxForPoint(point);
            const point2: Point = {
                x: 50,
                y: 50
            };
            boundingBox.updateBoundingBoxForPoint(point2);

            const pointOutsideOtherBoundingBox: Point = {
                x: 55,
                y: 55
            };
            const boundingBox2 = BoundingBox.getBoundingBoxForPoint(pointOutsideOtherBoundingBox);

            expect(boundingBox.getBoundingBoxAreaIfAddBoundingBox(boundingBox2)).to.equal(2750);
        });
        it('should calculate correctly if point is inside of the current bounding box', () => {
            const point: Point = {
                x: 0,
                y: 5
            };
            const boundingBox = BoundingBox.getBoundingBoxForPoint(point);
            const point2: Point = {
                x: 50,
                y: 50
            };
            boundingBox.updateBoundingBoxForPoint(point2);

            const pointOutsideOtherBoundingBox: Point = {
                x: 22,
                y: 22
            };
            const boundingBox2 = BoundingBox.getBoundingBoxForPoint(pointOutsideOtherBoundingBox);

            expect(boundingBox.getBoundingBoxAreaIfAddBoundingBox(boundingBox2)).to.equal(2250);
        });
    });

    describe('updateBoundingBoxForPoint', () => {
        let boundingBox: BoundingBox;
        beforeEach(() => {
            boundingBox = new BoundingBox();
        });
        it('should update bounding box after init', () => {
            const point: Point = {
                x: 0,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(point);
            expect(boundingBox.boundingBox.minX).to.equal(point.x);
            expect(boundingBox.boundingBox.minY).to.equal(point.y);
            expect(boundingBox.boundingBox.minX).to.equal(point.x);
            expect(boundingBox.boundingBox.maxY).to.equal(point.y);

        });
        it('should update minX and not maxX bounding box when new x is smaller', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(initPoint);

            const pointWithSmallerX: Point = {
                x: -1,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(pointWithSmallerX);
            expect(boundingBox.boundingBox.minX).to.equal(pointWithSmallerX.x);
            expect(boundingBox.boundingBox.maxX).to.equal(initPoint.x);
        });
        it('should update maxX and not minX bounding box when new x is larger', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(initPoint);

            const pointWithLargerX: Point = {
                x: 5,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(pointWithLargerX);
            expect(boundingBox.boundingBox.minX).to.equal(initPoint.x);
            expect(boundingBox.boundingBox.maxX).to.equal(pointWithLargerX.x);
        });
        it('should update minY and not maxY bounding box when new y is smaller', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(initPoint);

            const pointWithSmallerY: Point = {
                x: 0,
                y: 4
            };
            boundingBox.updateBoundingBoxForPoint(pointWithSmallerY);
            expect(boundingBox.boundingBox.minY).to.equal(pointWithSmallerY.y);
            expect(boundingBox.boundingBox.maxY).to.equal(initPoint.y);
        });
        it('should update maxY and not minY bounding box when new y is larger', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(initPoint);

            const pointWithLargerY: Point = {
                x: 0,
                y: 6
            };
            boundingBox.updateBoundingBoxForPoint(pointWithLargerY);
            expect(boundingBox.boundingBox.minY).to.equal(initPoint.y);
            expect(boundingBox.boundingBox.maxY).to.equal(pointWithLargerY.y);
        });
    });
    describe('updateBoundingBoxForBoundingBox', () => {
        let boundingBox: BoundingBox;
        beforeEach(() => {
            boundingBox = new BoundingBox();
        });
        it('should update minX and not maxX bounding box when new x is smaller', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForPoint(initPoint);

            const pointWithSmallerX: Point = {
                x: -5,
                y: 5
            };
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForPoint(pointWithSmallerX);
            boundingBox.updateBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minX).to.equal(pointWithSmallerX.x);
            expect(boundingBox.boundingBox.maxX).to.equal(initPoint.x);
        });
        it('should update maxX and not minX bounding box when new x is larger', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(initPoint);

            const pointWithLargerX: Point = {
                x: 5,
                y: 5
            };
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForPoint(pointWithLargerX);
            boundingBox.updateBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minX).to.equal(initPoint.x);
            expect(boundingBox.boundingBox.maxX).to.equal(pointWithLargerX.x);
        });
        it('should update minY and not maxY bounding box when new y is smaller', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(initPoint);

            const pointWithSmallerY: Point = {
                x: 0,
                y: 4
            };
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForPoint(pointWithSmallerY);
            boundingBox.updateBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minY).to.equal(pointWithSmallerY.y);
            expect(boundingBox.boundingBox.maxY).to.equal(initPoint.y);
        });
        it('should update maxY and not minY bounding box when new y is larger', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.updateBoundingBoxForPoint(initPoint);

            const pointWithLargerY: Point = {
                x: 0,
                y: 6
            };
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForPoint(pointWithLargerY);
            boundingBox.updateBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minY).to.equal(initPoint.y);
            expect(boundingBox.boundingBox.maxY).to.equal(pointWithLargerY.y);
        });
    });
});
