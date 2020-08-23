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
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForPoint(point);
        const newLeafNode = new LeafNode(point, boundingBox);

        // Recursively find the best position
        this._insert(this.root, newLeafNode)
        // // First if the root node has space.
        // if (!this.isNodeFull(this.root)) {
        //     this.root.insert(newLeafNode);
        //     return;
        // }
    }

    private _insert (currentNode: InternalNode, newNode: LeafNode) {
        const currentNodeChildren = currentNode.getChildren();
        // If currentNode has space
        if (currentNodeChildren.length < this.maxEntries) {
            // children is empty or they are leaf nodes,
            if (currentNode.childrenAreLeafNodes()) {
                currentNode.insert(newNode);
                return
            } else {
                // Create a new internal node and insert the LeafNode inside it.
                const newInternalNode = new InternalNode();
                newInternalNode.insert(newNode)
                currentNode.insert(newInternalNode);
                return;
            }
        }

        // The node's children are equal to the maxEntries.
        if (currentNode.childrenAreLeafNodes()) {
            currentNode.splitChildren();
        }

        

        // Find child that has space.
        // Insert as child of current node.
        // if currentNode children are leaf nodes
            // split children into 2 internal nodes
            // Create 2 internal nodes with the 2 most disimilar children
            // Add children to the node they are most similar to.
        // else // current node children are internal nodes


        // Does currentNode hold Leaf or Internal Nodes
    }
}
