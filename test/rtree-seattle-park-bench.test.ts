// Commented because an issue when running these tests.

import { expect } from 'chai'
import fs from 'fs';
import * as geojson from 'geojson';

import RTree from '../src/rtree';
import { BoundingBox } from '../src/bounding-box';
import { sortPoints } from './util';

describe('RTree: ParkBenchGeoJson test', () => {
    let rTree: RTree;
    let seattleParkBenches: SeattleParkBenches;
    beforeEach(() => {
        rTree = new RTree(4);

        seattleParkBenches = new SeattleParkBenches();
        rTree.import(seattleParkBenches.getParkBenchesGeoJson());
    });

    it('passing in bounding box with all park benches returns all points', () => {
        const boundingBox: BoundingBox = seattleParkBenches.getParkBenchBoundingBox();

        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected: Array<geojson.Feature<geojson.Point>> = seattleParkBenches.getParkBenchCoordinatesPoints();
        compareResultExpected(result, expected);
    });

    it('passing in bounding box for Cal Anderson Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.3073363304138,
            47.62017993543422,
            -122.30437517166138,
            47.62276881594957);
            const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected: Array<geojson.Feature<geojson.Point>> = getPointsForBoundingBox(seattleParkBenches.getParkBenchesGeoJson(), boundingBox);
        compareResultExpected(result, expected);
    });
    it('passing in bounding box for Miller Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.32009291648865,
            47.61534894408462,
            -122.31820464134216,
            47.618733577653224);
        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected: Array<geojson.Feature<geojson.Point>> = getPointsForBoundingBox(seattleParkBenches.getParkBenchesGeoJson(), boundingBox);
        compareResultExpected(result, expected);
    });

    it('passing in bounding box for Volunteer Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.3195457458496,
            47.627685889602006,
            -122.3093318939209,
            47.636998137833615);
        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected: Array<geojson.Feature<geojson.Point>> = getPointsForBoundingBox(seattleParkBenches.getParkBenchesGeoJson(), boundingBox);
        compareResultExpected(result, expected);
    });
    it('passing in bounding box for Lake Union Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.34143257141113,
            47.6246489281385,
            -122.33340740203856,
            47.629479060181986);
        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected: Array<geojson.Feature<geojson.Point>> = getPointsForBoundingBox(seattleParkBenches.getParkBenchesGeoJson(), boundingBox);
        compareResultExpected(result, expected);
    });

    it('passing in bounding box for Gas Works Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.33872890472414,
            47.64431374020374,
            -122.33201265335083,
            47.64695924930195);
        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected: Array<geojson.Feature<geojson.Point>> = getPointsForBoundingBox(seattleParkBenches.getParkBenchesGeoJson(), boundingBox);
        compareResultExpected(result, expected);
    });
});

const getPointsForBoundingBox = (parkBenches: geojson.FeatureCollection<geojson.Point> , boundingBox: BoundingBox): Array<geojson.Feature<geojson.Point>> => {
    const points: Array<geojson.Feature<geojson.Point>> = [];
    parkBenches.features.forEach(feature => {
        const x = feature.geometry.coordinates[0];
        const y = feature.geometry.coordinates[1];
        if (
            x > boundingBox.boundingBox.minX &&
            x < boundingBox.boundingBox.maxX &&
            y > boundingBox.boundingBox.minY &&
            y < boundingBox.boundingBox.maxY
        ) {
            points.push(feature);
        }
    });
    return points;
}

class SeattleParkBenches {
    private parkBenches: geojson.FeatureCollection<geojson.Point>;

    constructor () {
        this.parkBenches = getParkBenchGeoJson();
    }

    public getParkBenchesGeoJson (): geojson.FeatureCollection<geojson.Point> {
        return this.parkBenches;
    }

    public getParkBenchCoordinatesPoints (): Array<geojson.Feature<geojson.Point>>  {
        const parkBenchPoints: Array<geojson.Feature<geojson.Point>> = [];
        this.parkBenches.features.forEach(feature => {
            parkBenchPoints.push(feature);
        });
        return parkBenchPoints;
    }
    public getParkBenchBoundingBox (): BoundingBox {
        let minX: number = +Infinity;
        let minY: number = +Infinity;
        let maxX: number = -Infinity;
        let maxY: number = -Infinity;
        this.parkBenches.features.forEach(feature => {
            minX = Math.min(minX, feature.geometry.coordinates[0])
            minY = Math.min(minY, feature.geometry.coordinates[1])

            maxX = Math.max(maxX, feature.geometry.coordinates[0])
            maxY = Math.max(maxY, feature.geometry.coordinates[1])
        });
        return BoundingBox.getBoundingBoxForBoundingBoxValues(minX, minY, maxX, maxY);
    }
}

// Comparing the list of geojson features is too difficult for mocha/chai because
// the objects are too large for a deep compare. Instead just compare the sorted
// geometries.
const compareResultExpected = (result: Array<geojson.Feature<geojson.Point>>, expected: Array<geojson.Feature<geojson.Point>>): void => {
    const resultGeometry: Array<geojson.Geometry> = result.map(r => r.geometry);
    const expectedGeometry: Array<geojson.Geometry> = expected.map(r => r.geometry);
    expect(sortPoints(resultGeometry)).to.deep.equal(sortPoints(expectedGeometry));
}

const getParkBenchGeoJson = (): geojson.FeatureCollection<geojson.Point> => {
    const rawParkBenchdata = fs.readFileSync('./test/data/seattle-park-benches.geojson', 'utf-8');
    const seattleParkBenches: geojson.FeatureCollection<geojson.Point> = JSON.parse(rawParkBenchdata);
    return seattleParkBenches;
}
