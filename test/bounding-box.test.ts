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
            boundingBox.extendBoundingBoxForPoint(point2)
            expect(boundingBox.getBoundingBoxArea()).to.equal(25);
        });
    });

    describe('isBoundingBoxInBoundingBox', () => {
        it('should return true if bounding box is entirely inside.', () => {
            const boundingBox = BoundingBox.getBoundingBoxForPoint({
                x: 0,
                y: 0
            });
            boundingBox.extendBoundingBoxForPoint({
                x: 100,
                y: 100
            });

            const targetBoundingBox = BoundingBox.getBoundingBoxForPoint({
                x: 25,
                y: 25
            });
            targetBoundingBox.extendBoundingBoxForPoint({
                x: 50,
                y: 50
            });
            expect(boundingBox.isBoundingBoxInBoundingBox(targetBoundingBox)).to.be.true;
        });
        it('should return true if bounding box is partially inside.', () => {
            const boundingBox = BoundingBox.getBoundingBoxForPoint({
                x: 0,
                y: 0
            });
            boundingBox.extendBoundingBoxForPoint({
                x: 100,
                y: 100
            });

            const targetBoundingBox = BoundingBox.getBoundingBoxForPoint({
                x: 75,
                y: 75
            });
            targetBoundingBox.extendBoundingBoxForPoint({
                x: 125,
                y: 125
            });
            expect(boundingBox.isBoundingBoxInBoundingBox(targetBoundingBox)).to.be.true;
        });
        it('should return false if bounding box is entire outside.', () => {
            const boundingBox = BoundingBox.getBoundingBoxForPoint({
                x: 0,
                y: 0
            });
            boundingBox.extendBoundingBoxForPoint({
                x: 100,
                y: 100
            });

            const targetBoundingBox = BoundingBox.getBoundingBoxForPoint({
                x: 101,
                y: 101
            });
            targetBoundingBox.extendBoundingBoxForPoint({
                x: 125,
                y: 125
            });

            expect(boundingBox.isBoundingBoxInBoundingBox(targetBoundingBox)).to.be.false;
        });
    });

    describe('getBoundingBoxAreaIfExtended', () => {
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
            boundingBox.extendBoundingBoxForPoint(point2);

            const pointOutsideOtherBoundingBox: Point = {
                x: 55,
                y: 55
            };
            const boundingBox2 = BoundingBox.getBoundingBoxForPoint(pointOutsideOtherBoundingBox);

            expect(boundingBox.getBoundingBoxAreaIfExtended(boundingBox2)).to.equal(500);
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
            boundingBox.extendBoundingBoxForPoint(point2);

            const pointOutsideOtherBoundingBox: Point = {
                x: 22,
                y: 22
            };
            const boundingBox2 = BoundingBox.getBoundingBoxForPoint(pointOutsideOtherBoundingBox);

            expect(boundingBox.getBoundingBoxAreaIfExtended(boundingBox2)).to.equal(0);
        });
    });

    describe('extendBoundingBoxForPoint', () => {
        let boundingBox: BoundingBox;
        beforeEach(() => {
            boundingBox = new BoundingBox();
        });
        it('should update bounding box after init', () => {
            const point: Point = {
                x: 0,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(point);
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
            boundingBox.extendBoundingBoxForPoint(initPoint);

            const pointWithSmallerX: Point = {
                x: -1,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(pointWithSmallerX);
            expect(boundingBox.boundingBox.minX).to.equal(pointWithSmallerX.x);
            expect(boundingBox.boundingBox.maxX).to.equal(initPoint.x);
        });
        it('should update maxX and not minX bounding box when new x is larger', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(initPoint);

            const pointWithLargerX: Point = {
                x: 5,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(pointWithLargerX);
            expect(boundingBox.boundingBox.minX).to.equal(initPoint.x);
            expect(boundingBox.boundingBox.maxX).to.equal(pointWithLargerX.x);
        });
        it('should update minY and not maxY bounding box when new y is smaller', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(initPoint);

            const pointWithSmallerY: Point = {
                x: 0,
                y: 4
            };
            boundingBox.extendBoundingBoxForPoint(pointWithSmallerY);
            expect(boundingBox.boundingBox.minY).to.equal(pointWithSmallerY.y);
            expect(boundingBox.boundingBox.maxY).to.equal(initPoint.y);
        });
        it('should update maxY and not minY bounding box when new y is larger', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(initPoint);

            const pointWithLargerY: Point = {
                x: 0,
                y: 6
            };
            boundingBox.extendBoundingBoxForPoint(pointWithLargerY);
            expect(boundingBox.boundingBox.minY).to.equal(initPoint.y);
            expect(boundingBox.boundingBox.maxY).to.equal(pointWithLargerY.y);
        });
    });
    describe('extendBoundingBoxForBoundingBox', () => {
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
            boundingBox.extendBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minX).to.equal(pointWithSmallerX.x);
            expect(boundingBox.boundingBox.maxX).to.equal(initPoint.x);
        });
        it('should update maxX and not minX bounding box when new x is larger', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(initPoint);

            const pointWithLargerX: Point = {
                x: 5,
                y: 5
            };
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForPoint(pointWithLargerX);
            boundingBox.extendBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minX).to.equal(initPoint.x);
            expect(boundingBox.boundingBox.maxX).to.equal(pointWithLargerX.x);
        });
        it('should update minY and not maxY bounding box when new y is smaller', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(initPoint);

            const pointWithSmallerY: Point = {
                x: 0,
                y: 4
            };
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForPoint(pointWithSmallerY);
            boundingBox.extendBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minY).to.equal(pointWithSmallerY.y);
            expect(boundingBox.boundingBox.maxY).to.equal(initPoint.y);
        });
        it('should update maxY and not minY bounding box when new y is larger', () => {
            const initPoint: Point = {
                x: 0,
                y: 5
            };
            boundingBox.extendBoundingBoxForPoint(initPoint);

            const pointWithLargerY: Point = {
                x: 0,
                y: 6
            };
            const boundingBox2: BoundingBox = BoundingBox.getBoundingBoxForPoint(pointWithLargerY);
            boundingBox.extendBoundingBoxForBoundingBox(boundingBox2);

            expect(boundingBox.boundingBox.minY).to.equal(initPoint.y);
            expect(boundingBox.boundingBox.maxY).to.equal(pointWithLargerY.y);
        });
    });
});
