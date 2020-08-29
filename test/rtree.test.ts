import { expect } from 'chai'

import { BoundingBox } from '../src/bounding-box';
import { Point } from '../src/point';
import RTree from '../src/rtree';

describe('RTree test', () => {
    describe('constructor', () => {
        it('can create RTree empty', () => {
            const rTree = new RTree();
            expect(rTree).to.be.exist;
        });
        it('can create RTree and pass in maxEntries', () => {
            const MAX_ENTRIES = 10;
            const rTree = new RTree(MAX_ENTRIES);
            expect(rTree).to.be.exist;
        });
    });
    describe('insert and search', () => {
        it('can insert 1 point', () => {
            const rTree = new RTree();
            const point: Point = {
                x: 5,
                y: 10
            };

            rTree.insert(point);
            expect(rTree).to.be.exist;
        });
        describe('can search for values when search bounding box is 1d', () => {
            it('should return single values when single values exist.', () => {
                const rTree = new RTree();
                insertTestPoints(rTree);
                const searchBoundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
                    5,
                    10,
                    5,
                    10
                );
                const result = rTree.search(searchBoundingBox);
                const expected = [{
                    x: 5,
                    y: 10
                }];
                expect(result).to.deep.equal(expected);
            });
            it('should return 2 values when 2 values exist.', () => {
                const rTree = new RTree();
                insertTestPoints(rTree);
                const searchBoundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
                    22,
                    19,
                    22,
                    19
                )
                const result = rTree.search(searchBoundingBox);
                const expected = [{
                    x: 22,
                    y: 19
                },
                {
                    x: 22,
                    y: 19
                }];
                expect(result).to.deep.equal(expected);
            });
            it('should return multiple values when multiple values exist.', () => {
                const rTree = new RTree();
                insertTestPoints(rTree);
                const searchBoundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
                    22,
                    19,
                    22,
                    19
                )
                const result = rTree.search(searchBoundingBox);
                const expected = [{
                    x: 22,
                    y: 19
                },
                {
                    x: 22,
                    y: 19
                }];
                expect(result).to.deep.equal(expected);
            });
        });
    });
});

function insertTestPoints(rTree: RTree) {
    rTree.insert({
        x: 5,
        y: 10
    });
    rTree.insert({
        x: 10,
        y: 15
    });
    rTree.insert({
        x: 0,
        y: 0
    });
    rTree.insert({
        x: 44,
        y: 13
    });
    rTree.insert({
        x: 22,
        y: 19
    });
    rTree.insert({
        x: 37,
        y: 105
    });
    rTree.insert({
        x: 200,
        y: 255
    });
    rTree.insert({
        x: 22,
        y: 19
    });
    rTree.insert({
        x: 205,
        y: 1
    });
}
