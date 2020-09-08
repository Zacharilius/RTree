import * as geojson from 'geojson';
import { BoundingBox } from './bounding-box';

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

    // public remove(node: InternalNode | LeafNode) {
    //     // TODO: Figure out something here.
    //     // Typescript recognizes that it's possible to mix InternalNode and
    //     // LeafNode here.
    //     const children: any = this.getChildren();
    //     const index = children.indexOf(node, 0);
    //     if (index > -1) {
    //         this.getChildren().splice(index, 1);
    //     }
    //     // TODO: Update bounding box.
    // }

    public splitChildren() {
        // TODO: Verify that children are LeafNodes
        const children: Array<LeafNode> = this.getChildren() as Array<LeafNode>;

        // Remove all leaf nodes;
        const leafChildren: Array<LeafNode> = [];
        while (children.length > 0) {
            leafChildren.push(children.shift() as LeafNode)
        }

        // Insert new Internal nodes, each with a leaf node.
        leafChildren.forEach(leafNode => {
            const newInternalNode = new InternalNode();
            this.insert(newInternalNode);
            newInternalNode.insert(leafNode)
        });
    }

    private updateBoundingBoxOnInsert(node: InternalNode | LeafNode) {
        this.boundingBox.extendBoundingBoxForBoundingBox(node.boundingBox);
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
    private feature: geojson.Feature;

    constructor (feature: geojson.Feature, boundingBox: BoundingBox) {
        super(boundingBox);
        this.feature = feature;
    }

    public isLeafNode () {
        return true;
    }

    public getFeature () {
        return this.feature;
    }
}
