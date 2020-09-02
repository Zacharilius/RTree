import { Point } from '../src/point';

export const sortPoints = (points: Array<Point>): Array<Point> => {
    points.sort((a: Point, b: Point) => {
        if(a.x == b.x) {
            return (a.y < b.y) ? -1 : (a.y > b.y) ? 1 : 0;
        } else {
            return (a.x < b.x) ? -1 : 1;
        }
    });
    return points;
}
