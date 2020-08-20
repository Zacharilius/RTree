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
        // If currentNode is empty or has space
        if (currentNodeChildren.length < this.maxEntries) {
            // If children is empty or they are leaf nodes,
            if (currentNode.canInsertLeafNode()) {
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
        if (currentNode.canInsertLeafNode()) {
            
            // currentNode is full and are children are leaf nodes.
            // then add children to new internal nodes.
        }

        // If node is full and the children are leaf nodes, then the children leaf nodes need
        // 


        // Find child that has space.
        // Insert as child of current node.
        // if currentNode children are leaf nodes
            // split children into 2 internal nodes
            // Create 2 internal nodes with the 2 most disimilar children
            // Add children to the node they are most similar to.
        // else // current node children are internal nodes
            

        

        // Does currentNode hold Leaf or Internal Nodes
    }

    private splitNode(currentNode: InternalNode) {
        const children = currentNode.getChildren();
        const newInternalNode1 = new InternalNode()
        children.splice(0, children.length / 2).forEach((childNode: InternalNode | LeafNode) => {
            newInternalNode1.insert(childNode)
        });

        const newInternalNode2 = new InternalNode()
        children.splice(children.length / 2, children.length).forEach((childNode: InternalNode | LeafNode) => {
            newInternalNode2.insert(childNode)
        });
        
        const rightLeafNode = new InternalNode()
    }

    private getBoundingBoxForPoint (point: Point): BoundingBox {
        return {
            minX: point.x,
            minY: point.y,
            maxX: point.x,
            maxY: point.y,
        };
    }
}
