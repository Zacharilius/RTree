import * as geojson from 'geojson';

export const sortPoints = (pointGeometries: Array<geojson.Geometry>): Array<geojson.Geometry> => {
    pointGeometries.sort((a: any, b: any) => {
        a = a as geojson.Point;
        b = b as geojson.Point;
        const aX = a.coordinates[0];
        const bX = b.coordinates[0];
        const aY = a.coordinates[0];
        const bY = b.coordinates[0];

        if(aX == bX) {
            return (aY < bY) ? -1 : (aY > bY) ? 1 : 0;
        } else {
            return (aX < bX) ? -1 : 1;
        }
    });
    return pointGeometries;
}
