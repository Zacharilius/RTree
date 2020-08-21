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
        describe('remove', () => {
            it('can remove LeafNode from InternalNode', () => {
                const internalNode = new InternalNode();
                const leafNode = createLeafNode();
                internalNode.insert(leafNode);
                internalNode.remove(leafNode);
                expect(internalNode.getChildren()).to.deep.equal([])
            });
        });

        describe('splitChildren', () => {
            // TODO
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

const createLeafNode = (): LeafNode => {
    const point: Point = {
        x: 5,
        y: 10
    };
    const boundingBox: BoundingBox = {
        minX: 1,
        minY: 2,
        maxX: 3,
        maxY: 4,
    }
    return new LeafNode(point, boundingBox);
}
