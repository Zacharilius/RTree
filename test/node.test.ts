import { expect } from 'chai'

import { BoundingBox } from '../src/bounding-box';
import { InternalNode, LeafNode } from '../src/node';
import { Point } from '../src/point';

describe('Node test', () => {
    describe('LeafNode', () => {
        describe('constructor', () => {
            it('can create LeafNode', () => {
                const leafNode = createLeafNode();
                expect(leafNode).to.be.exist;
                expect(leafNode.isLeafNode()).to.be.true;
            });
        });
        describe('getData', () => {
            it('returns the correct data', () => {
                const x: number = 22;
                const y: number = 33;
                const leafNode = createLeafNode(x, y);
                expect(leafNode.getData()).to.deep.equal({ x, y });
            });
        });
    });
    describe('InternalNode', () => {
        describe('constructor', () => {
            it('can create InternalNode', () => {
                const internalNode = new InternalNode();
                expect(internalNode).to.be.exist;
                expect(internalNode.isLeafNode()).to.be.false;
            });
        });
        describe('insert', () => {
            it('can insert LeafNode into InternalNode', () => {
                const internalNode = new InternalNode();
                const leafNode = createLeafNode();
                internalNode.insert(leafNode);
                expect(internalNode.getChildren()).to.deep.equal([leafNode])
            });
            it('can insert InternalNode into InternalNode', () => {
                const internalNodeRoot = new InternalNode();
                const leafNodeChild = new InternalNode();
                internalNodeRoot.insert(leafNodeChild);
                expect(internalNodeRoot.getChildren()).to.deep.equal([leafNodeChild])
            });
        });
        // describe('remove', () => {
        //     it('can remove LeafNode from InternalNode', () => {
        //         const internalNode = new InternalNode();
        //         const leafNode = createLeafNode();
        //         internalNode.insert(leafNode);
        //         internalNode.remove(leafNode);
        //         expect(internalNode.getChildren()).to.deep.equal([])
        //     });
        // });

        describe('splitChildren', () => {
            it('should create a new internal node and insert the leaf node in it.', () => {
                const internalNode = new InternalNode();

                // Create 4 nodes nad then insert into the internal nodes.
                const leafNodeCount = 4;
                let leafNodes: Array<LeafNode> = [];
                for (let i = 0; i < leafNodeCount; i++) {
                    leafNodes.push(createLeafNode(i, i));
                    internalNode.insert(leafNodes[i]);
                }

                // Should have 4 leaf nodes
                expect(internalNode.getChildren().length).to.equal(4);

                internalNode.splitChildren();

                // Should have 4 internal nodes nodes
                expect(internalNode.getChildren().length).to.equal(4);
                internalNode.getChildren().forEach((thisInternalNode: any, index: number) => {
                    expect(thisInternalNode.isLeafNode()).to.be.false;
                    expect(thisInternalNode.getChildren()[0]).to.equal(leafNodes[index]);
                });
            });
        });

        describe('isEmpty', () => {
            it('start as empty', () => {
                const internalNode = new InternalNode();
                expect(internalNode.isEmpty()).to.be.true;
            });
            it('become not empty when a node is added.', () => {
                const internalNode = new InternalNode();
                const internalNodeChild = new InternalNode();
                internalNode.insert(internalNodeChild);
                expect(internalNode.isEmpty()).to.be.false;
            });
        });
        describe('getChildren', () => {
            it('returns an empty list when a node has no children', () => {
                const internalNode = new InternalNode();
                expect(internalNode.getChildren()).to.deep.equal([]);
            });
            it('returns the correct node when a node has a child', () => {
                const internalNode = new InternalNode();
                const internalNodeChild = new InternalNode();
                internalNode.insert(internalNodeChild);
                expect(internalNode.getChildren()).to.deep.equal([internalNodeChild]);
            });
        });
    });
});

const createLeafNode = (x: number = 5, y: number = 10): LeafNode => {
    const point: Point = {
        x,
        y
    };
    const boundingBox = new BoundingBox();
    return new LeafNode(point, boundingBox);
}
