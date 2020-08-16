import { BoundingBox } from './bounding-box';
import { Point } from './point';

class Node {
    private boundingBox: BoundingBox | undefined;

    constructor (boundingBox?: BoundingBox) {
        this.boundingBox = boundingBox;
    }
}

export class InternalNode extends Node {
    private childNodes: Array<Node>;

    constructor () {
        super();
        this.childNodes = [];
    }

    public insertNode(node: InternalNode | LeafNode) {
        this.childNodes.push(node);
    }

    public getNumChildren(): number {
        return this.childNodes.length;
    }
}

export class LeafNode extends Node {
    private data: Point;

    constructor (data: Point, boundingBox: BoundingBox) {
        super(boundingBox);
        this.data = data;        
    }
}
