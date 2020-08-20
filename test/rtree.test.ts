import { expect } from 'chai'

import RTree from '../src/index';

describe('RTree test', () => {
    describe('constructor', () => {
        it('can create RTree empty', () => {
            const rTree = new RTree();
            expect(rTree).to.be.exist;
        });
        it('can create RTree and pass in maxEntries', () => {
            const MAX_ENTRIES = 10;
            const rTree = new RTree(MAX_ENTRIES);
            expect(rTree).to.be.exist;
        });
    });
});
