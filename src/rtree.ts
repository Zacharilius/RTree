
import { InternalNode, LeafNode } from './node';
import { BoundingBox } from './bounding-box';
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

    public search (boundingBox: BoundingBox): Array<Point> {
        const foundPoints: Array<Point> = [];
        this._search(this.root, boundingBox, foundPoints);
        return foundPoints;
    }

    private _search (node: InternalNode | LeafNode, boundingBox: BoundingBox, foundPoints: Array<Point>) {
        if (node.isLeafNode()) {
            node = node as LeafNode
            if (node.boundingBox.isBoundingBoxInBoundingBox(boundingBox)) {
                foundPoints.push(node.getData());
            }
        } else {
            node = node as InternalNode
            node.getChildren().forEach((childNode: InternalNode | LeafNode) => {
                if (childNode.boundingBox.isBoundingBoxInBoundingBox(boundingBox)) {
                    this._search(childNode, boundingBox, foundPoints);
                }
            });
        }
    }

    // TODO: There's a bug when maxEntries is set to 1.
    public insert (point: Point): void {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForPoint(point);
        const newLeafNode = new LeafNode(point, boundingBox);

        // Recursively find the best position
        this._insert(this.root, newLeafNode)
    }

    private _insert (currentNode: InternalNode, newNode: LeafNode): void {
        let currentNodeChildren: Array<InternalNode> | Array<LeafNode> = currentNode.getChildren();
        // If currentNode has space
        if (currentNodeChildren.length < this.maxEntries) {
            // children is empty or they are leaf nodes,
            if (currentNode.childrenAreLeafNodes()) {
                currentNode.insert(newNode);
                return
            }
        }

        // TODO: Verify if the bounding box is being updated everywhere it needs
        // to be updated.

        // Before inserting in the child of the current node. Update the current
        // node's bounding box.
        currentNode.boundingBox.updateBoundingBoxForBoundingBox(newNode.boundingBox);

        // The all nodes are leaf nodes and node is full then split each child
        // leaf node into its own internal node.
        if (currentNode.childrenAreLeafNodes()) {
            currentNode.splitChildren();
            currentNodeChildren = currentNode.getChildren();
            const firstChild = currentNodeChildren[0]
            return this._insert(firstChild as InternalNode, newNode);
        }

        // Recursively insert.
        // Find the child node with the bounding box that will require the least adjustment.
        currentNodeChildren = currentNodeChildren as Array<InternalNode>;
        const boundingBoxInfos: Array<any> = currentNodeChildren.map((node: InternalNode) => {
            return {
                node: node,
                area: node.boundingBox.getBoundingBoxAreaIncreaseIfAddBoundingBox(newNode.boundingBox)
            };
        });

        // sort so smallest area is first.
        boundingBoxInfos.sort((a, b) => {
            if (a.area > b.area) {
                return -1;
            }
            if (a.area < b.area) {
                return 1;
            }
            return 0;
        });

        // Insert in the child node that would have the least bounding box area
        // increase.
        this._insert(boundingBoxInfos[0].node, newNode);
    }
}
