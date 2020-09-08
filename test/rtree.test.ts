import { expect } from 'chai'
import * as geojson from 'geojson';

import { BoundingBox } from '../src/bounding-box';
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
        let points: Array<geojson.Feature<geojson.Point>>;
        beforeEach(() => {
            points = [
                createPointFeature(5, 10),
                createPointFeature(10, 15),
                createPointFeature(0, 0),
                createPointFeature(44, 13),
                createPointFeature(22, 19),
                createPointFeature(37, 105),
                createPointFeature(200, 255),
                createPointFeature(22, 19),
                createPointFeature(205, 1),
            ];
        });

        it('can insert 1 point', () => {
            const rTree = new RTree();
            const point: geojson.Feature<geojson.Point> = createPointFeature(5, 10);
            rTree.insert(point);
            expect(rTree).to.be.exist;
        });
        describe('can search for values when search bounding box is 1d', () => {
            it('should return empty array when no values exist.', () => {
                const rTree = createTestRTree(points);
                const searchBoundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
                    5,
                    6,
                    5,
                    6
                );
                const result = rTree.search(searchBoundingBox);
                const expected: Array<geojson.Feature<geojson.Point>> = [];
                expect(result).to.deep.equal(expected);
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
                expect(result).to.deep.equal([{
                    geometry: {
                        type: "Point",
                        "coordinates": [5, 10]
                    },
                    properties: {},
                    type: "Feature"
                }]);
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
                expect(result).to.deep.equal([
                    {
                        geometry: {
                            type: "Point",
                            "coordinates": [22, 19]
                        },
                        properties: {},
                        type: "Feature"
                    },
                    {
                        geometry: {
                            type: "Point",
                            "coordinates": [22, 19]
                        },
                        properties: {},
                        type: "Feature"
                    }
                ]);
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
                expect(result).to.deep.equal([
                    {
                        geometry: {
                            type: "Point",
                            "coordinates": [22, 19]
                        },
                        properties: {},
                        type: "Feature"
                    },
                    {
                        geometry: {
                            type: "Point",
                            "coordinates": [22, 19]
                        },
                        properties: {},
                        type: "Feature"
                    }
                ]);
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
                expect(result).to.deep.equal([
                    {
                        geometry: {
                            type: "Point",
                            "coordinates": [5, 10]
                        },
                        properties: {},
                        type: "Feature"
                    },
                    {
                        geometry: {
                            type: "Point",
                            "coordinates": [10, 15]
                        },
                        properties: {},
                        type: "Feature"
                    },
                    {
                        geometry: {
                            type: "Point",
                            "coordinates": [0, 0]
                        },
                        properties: {},
                        type: "Feature"
                    }
                ]);
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
                expect(result).to.deep.equal([
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                5,
                                10
                            ]
                        },
                        properties: {}
                    },
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                22,
                                19
                            ]
                        },
                        properties: {}
                    },
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                200,
                                255
                            ]
                        },
                        properties: {}
                    },
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                10,
                                15
                            ]
                        },
                        properties: {}
                    },
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                0,
                                0
                            ]
                        },
                        properties: {}
                    },
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                37,
                                105
                            ]
                        },
                        properties: {}
                    },
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                205,
                                1
                            ]
                        },
                        properties: {}
                    },
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                44,
                                13
                            ]
                        },
                        properties: {}
                    },
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            "coordinates": [
                                22,
                                19
                            ]
                        },
                        properties: {}
                    }
                ]);
            });
        });
    });
    describe('import', () => {
        let geoJson: geojson.FeatureCollection<geojson.Point>;
        beforeEach(() => {
            geoJson = {
                type: "FeatureCollection",
                "features": [
                  {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        "coordinates": [
                            0,
                            0
                        ]
                    },
                    properties: {}
                  }
                ]
            };
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
            expect(result).to.deep.equal([
                {
                  type: "Feature",
                  geometry: {
                      type: "Point",
                      "coordinates": [
                          0,
                          0
                      ]
                  },
                  properties: {}
                }
              ]);
        });
    });
});

const createPointFeature = (x: number, y: number): geojson.Feature<geojson.Point> => {
    const pointFeature: geojson.Feature<geojson.Point> = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [x, y]
        },
        properties: {}
    };
    return pointFeature
}

function createTestRTree(features: Array<geojson.Feature>): RTree {
    const rTree = new RTree(4);
    features.forEach(f => rTree.insert(f));
    return rTree;
}
