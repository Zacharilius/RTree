import { BoundingBox } from './bounding-box';
import { Point } from './point';

abstract class Node {
    boundingBox: BoundingBox;

    constructor (boundingBox?: BoundingBox) {
        if (boundingBox) {
            this.boundingBox = boundingBox;
        } else {
            // Set the bounding box to values that will always be overridden.
            this.boundingBox = new BoundingBox();
        }
    }

    abstract isLeafNode (): boolean;

    getBoundingBox (): BoundingBox {
        return this.boundingBox;
    }
}

export class InternalNode extends Node {
    private childNodes: Array<InternalNode> | Array<LeafNode>;

    constructor () {
        super();
        this.childNodes = [];
    }

    public insert(node: InternalNode | LeafNode) {
        // TODO: Figure out something here.
        // Typescript recognizes that it's possible to mix InternalNode and
        // LeafNode here.
        this.childNodes.push(node as any);
        this.updateBoundingBoxOnInsert(node);
    }

    public remove(node: InternalNode | LeafNode) {
        // TODO: Figure out something here.
        // Typescript recognizes that it's possible to mix InternalNode and
        // LeafNode here.
        const children: any = this.getChildren();
        const index = children.indexOf(node, 0);
        if (index > -1) {
            this.getChildren().splice(index, 1);
        }
        // TODO: Update bounding box.
    }

    // What is the best way to do this?
    public splitChildren() {
        // TODO: Verify that children are LeafNodes
        const children = this.getChildren() as Array<LeafNode>;
        children.forEach((childLeafNode) => {
            this.remove(childLeafNode);
            const newInternalNode = new InternalNode();
            this.insert(newInternalNode);
            newInternalNode.insert(childLeafNode)
        });
    }

    private updateBoundingBoxOnInsert(node: InternalNode | LeafNode) {
        this.boundingBox.updateBoundingBoxForBoundingBox(node.boundingBox);
    }

    public childrenAreLeafNodes(): boolean {
        return this.getChildren().every((node: Node) => node.isLeafNode());
    }

    public isEmpty(): boolean {
        return this.getChildren().length === 0;
    }

    public getChildren(): Array<InternalNode> | Array<LeafNode> {
        return this.childNodes
    }

    public isLeafNode () {
        return false;
    }
}

export class LeafNode extends Node {
    private data: Point;

    constructor (data: Point, boundingBox: BoundingBox) {
        super(boundingBox);
        this.data = data;
    }

    public isLeafNode () {
        return true;
    }
}
