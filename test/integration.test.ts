import { expect } from 'chai'
import fs from 'fs';
import * as geojson from 'geojson';

import RTree from '../src/rtree';
import { BoundingBox } from '../src/bounding-box';
import { sortPoints } from './util';

describe('point-seattle-park-benches', () => {
    let rTree: RTree;
    let seattleParkBenches: GeoJsonHelper;
    beforeEach(() => {
        rTree = new RTree(4);

        seattleParkBenches = new GeoJsonHelper('point-seattle-park-benches');
        rTree.import(seattleParkBenches.getParsedGeoJsonFeatureCollection());
    });

    it('passing in bounding box with all park benches returns all points', () => {
        const boundingBox: BoundingBox = seattleParkBenches.getBoundingBox();

        const result = rTree.search(boundingBox);
        const expected = seattleParkBenches.getGeoJsonFeatures();
        compareResultExpected(result, expected);
    });

    it('passing in bounding box for Cal Anderson Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.3073363304138,
            47.62017993543422,
            -122.30437517166138,
            47.62276881594957);
            const result = rTree.search(boundingBox);
        const expected= getPointsForBoundingBox(seattleParkBenches.getParsedGeoJsonFeatureCollection(), boundingBox);;
        compareResultExpected(result, expected);
    });
    it('passing in bounding box for Miller Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.32009291648865,
            47.61534894408462,
            -122.31820464134216,
            47.618733577653224);
        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected = getPointsForBoundingBox(seattleParkBenches.getParsedGeoJsonFeatureCollection(), boundingBox);
        compareResultExpected(result, expected);
    });

    it('passing in bounding box for Volunteer Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.3195457458496,
            47.627685889602006,
            -122.3093318939209,
            47.636998137833615);
        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected = getPointsForBoundingBox(seattleParkBenches.getParsedGeoJsonFeatureCollection(), boundingBox);
        compareResultExpected(result, expected);
    });
    it('passing in bounding box for Lake Union Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.34143257141113,
            47.6246489281385,
            -122.33340740203856,
            47.629479060181986);
        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected = getPointsForBoundingBox(seattleParkBenches.getParsedGeoJsonFeatureCollection(), boundingBox);
        compareResultExpected(result, expected);
    });

    it('passing in bounding box for Gas Works Park will return all park benches', () => {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForBoundingBoxValues(
            -122.33872890472414,
            47.64431374020374,
            -122.33201265335083,
            47.64695924930195);
        const result = rTree.search(boundingBox) as Array<geojson.Feature<geojson.Point>>;
        const expected = getPointsForBoundingBox(seattleParkBenches.getParsedGeoJsonFeatureCollection(), boundingBox);
        compareResultExpected(result, expected);
    });
});

describe('multilinestring-seattle-park-trails', () => {
    let rTree: RTree;
    let parkTrails: GeoJsonHelper;
    beforeEach(() => {
        rTree = new RTree(4);

        parkTrails = new GeoJsonHelper('multilinestring-seattle-park-trails');
        rTree.import(parkTrails.getParsedGeoJsonFeatureCollection());
    });

    it('passing in bounding box with all trails returns all trails', () => {
        const boundingBox: BoundingBox = parkTrails.getBoundingBox();

        const result = rTree.search(boundingBox);
        const expected = parkTrails.getGeoJsonFeatures();
        compareResultExpected(result, expected);
    });
});

describe('polygon-multipolygon-us-states-500k', () => {
    let rTree: RTree;
    let parkTrails: GeoJsonHelper;
    beforeEach(() => {
        rTree = new RTree(4);

        parkTrails = new GeoJsonHelper('polygon-multipolygon-us-states-500k');
        rTree.import(parkTrails.getParsedGeoJsonFeatureCollection());
    });

    it('passing in bounding box with all trails returns all trails', () => {
        const boundingBox: BoundingBox = parkTrails.getBoundingBox();

        const result = rTree.search(boundingBox);
        const expected = parkTrails.getGeoJsonFeatures();
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

class GeoJsonHelper {
    private geoJsonFeateCollection: geojson.FeatureCollection<geojson.Point>;

    constructor (geoJsonFileName: string) {
        this.geoJsonFeateCollection = getGeoJson(geoJsonFileName) as geojson.FeatureCollection<geojson.Point>;
    }

    public getParsedGeoJsonFeatureCollection (): geojson.FeatureCollection<geojson.Point> {
        return this.geoJsonFeateCollection;
    }

    public getGeoJsonFeatures (): Array<geojson.Feature>  {
        const features: Array<geojson.Feature> = [];
        this.geoJsonFeateCollection.features.forEach(feature => {
            features.push(feature);
        });
        return features;
    }
    public getBoundingBox (): BoundingBox {
        let minX: number = +Infinity;
        let minY: number = +Infinity;
        let maxX: number = -Infinity;
        let maxY: number = -Infinity;
        this.geoJsonFeateCollection.features.forEach(feature => {
            const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(feature);

            minX = Math.min(minX, boundingBox.boundingBox.minX)
            minY = Math.min(minY, boundingBox.boundingBox.minY)
            maxX = Math.max(maxX, boundingBox.boundingBox.maxX)
            maxY = Math.max(maxY, boundingBox.boundingBox.maxY)
        });
        return BoundingBox.getBoundingBoxForBoundingBoxValues(minX, minY, maxX, maxY);
    }
}

// Comparing the list of geojson features is too difficult for mocha/chai because
// the objects are too large for a deep compare. Instead just compare the sorted
// geometries.
const compareResultExpected = (result: Array<geojson.Feature>, expected: Array<geojson.Feature>): void => {
    const resultGeometry: Array<geojson.Geometry> = result.map(r => r.geometry);
    const expectedGeometry: Array<geojson.Geometry> = expected.map(r => r.geometry);
    expect(sortPoints(resultGeometry)).to.deep.equal(sortPoints(expectedGeometry));
}

const getGeoJson = (fileName: string): geojson.FeatureCollection => {
    const fileContents: string = fs.readFileSync(`./test/data/${fileName}.geojson`, 'utf-8');
    return JSON.parse(fileContents) as geojson.FeatureCollection;
}
