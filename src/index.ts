export default class RTree {
    // Max width of node before split
    private maxEntries: number;
    // Min width of node before split
    private minEntries: number;

    constructor (maxEntries: number = 9) {
        // TODO: Investigate optimizations for min and max entries.
        this.maxEntries = maxEntries;
        this.minEntries = Math.floor(maxEntries / 2)
    }
}
