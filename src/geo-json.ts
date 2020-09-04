export interface GeoJson {
    type: GeoJsonType;
    features: Array<Feature>;
}

type GeoJsonType = 'FeatureCollection';

export interface Feature {
    type: string;
    geometry: Geometry;
    properties: FeatureProperties
}

interface Geometry {
    type: GeometryType;
    coordinates: Array<number>;
}

export enum GeometryType {
    Point = 'Point',
    LineString = 'LineString',
    Polygon = 'Polygon',
    MultiPoint = 'MultiPoint',
    MultiLineString = 'MultiLineString',
    MultiPolygon = 'MultiPolygon'
}

type FeatureProperties = { [name: string]: any; } | null;
