import fs from 'fs';

export interface SeattleParkBenchGeoJson {
    type: string;
    features: Array<SeattleParkBenchFeature>;
}

interface SeattleParkBenchFeature {
    type: string;
    properties: SeattleParkBenchFeatureProperties;
    geometry: SeattleParkBenchFeatureGeometry;
}

interface SeattleParkBenchFeatureProperties {
    bench_size: string;
    bench_pad: string;
    gis_edt_dt: string;
    amwoid: string;
    bnchname: string;
    pmaid: string;
    bench_type: string;
    life_cycle: string;
    gis_edt_sr: string;
}

declare type Coordinates = [number, number]

interface SeattleParkBenchFeatureGeometry {
    type: string;
    coordinates: Coordinates
}

export const getParkBenchGeoJson = (): SeattleParkBenchGeoJson => {
    const rawParkBenchdata = fs.readFileSync('./test/data/seattle-park-benches.geojson', 'utf-8');
    const seattleParkBenches: SeattleParkBenchGeoJson = JSON.parse(rawParkBenchdata);
    return seattleParkBenches;
}
