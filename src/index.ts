import { BoundingBox } from './bounding-box';
import { InternalNode, LeafNode } from './node';
import { Point } from './point';

export default class RTree {
    // Max width of node before split
    private maxEntries: number;
    // Min width of node before split
    private minEntries: number;

    private root: InternalNode;

    constructor (maxEntries: number = 9) {
        // TODO: Investigate optimizations for min and max entries.
        this.maxEntries = maxEntries;
        this.minEntries = Math.floor(maxEntries / 2)
        this.root = new InternalNode();
    }

    public insert (point: Point): void {
        const boundingBox: BoundingBox = this.getBoundingBoxForPoint(point);
        const newLeafNode = new LeafNode(point, boundingBox);

        // First if the root node has space.
        if (this.root.getNumChildren() < this.maxEntries) {
            this.root.insertNode(newLeafNode);
        }

        // Recursively find the best child to add the new leaf node to.
            // If num children > maxEntries, then ...
    }

    private getBoundingBoxForPoint (point: Point): BoundingBox {
        return {
            minX: point.x,
            minY: point.y,
            maxX: point.x,
            maxY: point.y,
        }
    }
}
