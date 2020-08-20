import { BoundingBox } from './bounding-box';
import { Point } from './point';

abstract class Node {
    boundingBox: BoundingBox;

    constructor (boundingBox?: BoundingBox) {
        if (boundingBox) {
            this.boundingBox = boundingBox;
        } else {
            // Set the bounding box to values that will always be overridden.
            this.boundingBox = {
                minX: +Infinity,
                minY: +Infinity,
                maxX: -Infinity,
                maxY: -Infinity,
            };
        }
    }

    abstract isLeafNode (): boolean;
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
        this.updateBoundingBox(node);
    }

    private updateBoundingBox(node: InternalNode | LeafNode) {
        this.boundingBox.minX = Math.min(this.boundingBox.minX, node.boundingBox.minX);
        this.boundingBox.minY = Math.min(this.boundingBox.minY, node.boundingBox.minY);
        this.boundingBox.maxX = Math.max(this.boundingBox.maxX, node.boundingBox.maxX);
        this.boundingBox.maxY = Math.max(this.boundingBox.maxY, node.boundingBox.maxY);
    }

    public canInsertLeafNode(): boolean {
        return this.getChildren().every((node: Node) => node.isLeafNode());
    }

    public isEmpty(): boolean {
        return this.getNumChildren() === 0;
    }

    public getChildren(): Array<InternalNode> | Array<LeafNode> {
        return this.childNodes
    }

    public getNumChildren(): number {
        return this.childNodes.length;
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
