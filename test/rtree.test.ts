import { expect } from 'chai'

import { BoundingBox } from '../src/bounding-box';
import { GeoJson, Feature } from '../src/geo-json';
import { Point } from '../src/point';
import { sortPoints } from './util';
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
        let points: Array<Point>;
        beforeEach(() => {
            points = [
                { x: 5, y: 10 },
                { x: 10, y: 15 },
                { x: 0, y: 0 },
                { x: 44, y: 13 },
                { x: 22, y: 19 },
                { x: 37, y: 105 },
                { x: 200, y: 255 },
                { x: 22, y: 19 },
                { x: 205, y: 1 },
            ];
        });

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
                const rTree = createTestRTree(points);
                const searchBoundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
                    5,
                    6,
                    5,
                    6
                );
                const result = rTree.search(searchBoundingBox);
                const expected: Array<Point> = [];
                expect(sortPoints(result)).to.deep.equal(sortPoints(expected));
            });
            it('should return single values when single values exist.', () => {
                const rTree = createTestRTree(points);
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
                expect(sortPoints(result)).to.deep.equal(sortPoints(expected));
            });
            it('should return 2 values when 2 values exist.', () => {
                const rTree = createTestRTree(points);
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
                expect(sortPoints(result)).to.deep.equal(sortPoints(expected));
            });
            it('should return correct values when multiple values exist for bounding box: 22, 19, 22, 19', () => {
                const rTree = createTestRTree(points);
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
                expect(sortPoints(result)).to.deep.equal(sortPoints(expected));
            });
            it('should return correct values when multiple values exist for bounding box: 0, 0, 10, 15', () => {
                const rTree = createTestRTree(points);
                const searchBoundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
                    0,
                    0,
                    10,
                    15
                )
                const result = rTree.search(searchBoundingBox);
                const expected = [{
                    x: 5,
                    y: 10
                },
                {
                    x: 10,
                    y: 15
                },
                {
                    x: 0,
                    y: 0
                }];
                expect(sortPoints(result)).to.deep.equal(sortPoints(expected));
            });

            it('should return all values for bounding box', () => {
                const rTree = createTestRTree(points);
                const searchBoundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
                    0,
                    0,
                    360,
                    360
                );
                const result = rTree.search(searchBoundingBox);
                const expected = points;
                expect(sortPoints(result)).to.deep.equal(sortPoints(expected));
            });
        });
    });
    describe('import', () => {
        let geoJson: GeoJson;
        beforeEach(() => {
            geoJson = {
                "type": "FeatureCollection",
                "features": [
                  {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            0,
                            0
                        ]
                    }
                  }
                ]
            } as GeoJson;
        });

        it('should import geoJson correctly', () => {
            const rTree = new RTree();
            rTree.import(geoJson);
            const searchBoundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
                0,
                0,
                0,
                0
            );
            const result = rTree.search(searchBoundingBox);
            expect(result).to.deep.equal([{ x: 0, y: 0 }]);
        });
        it('should throw an error for non-point geoJson features', () => {
            const rTree = new RTree();
            geoJson.features.push(                  {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            } as Feature);

            expect(() => rTree.import(geoJson)).to.throw();
        });
    });
});

function createTestRTree(points: Array<Point>): RTree {
    const rTree = new RTree(4);
    points.forEach(p => rTree.insert(p));
    return rTree;
}
