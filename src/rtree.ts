
import * as geojson from 'geojson';
import { InternalNode, LeafNode } from './node';
import { BoundingBox } from './bounding-box';

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

    public search (boundingBox: BoundingBox): Array<geojson.Feature> {
        const foundFeatures: Array<geojson.Feature> = [];
        this._search(this.root, boundingBox, foundFeatures);
        return foundFeatures;
    }

    private _search (node: InternalNode | LeafNode, boundingBox: BoundingBox, foundFeatures: Array<geojson.Feature>) {
        if (node.isLeafNode()) {
            node = node as LeafNode
            if (node.boundingBox.isBoundingBoxInBoundingBox(boundingBox)) {
                foundFeatures.push(node.getFeature());
            }
        } else {
            node = node as InternalNode
            node.getChildren().forEach((childNode: InternalNode | LeafNode) => {
                if (childNode.boundingBox.isBoundingBoxInBoundingBox(boundingBox)) {
                    this._search(childNode, boundingBox, foundFeatures);
                }
            });
        }
    }

    // TODO: There's a bug when maxEntries is set to 1.
    public insert (feature: geojson.Feature): void {
        const boundingBox: BoundingBox = BoundingBox.getBoundingBoxForGeoJSONFeature(feature);
        const newLeafNode = new LeafNode(feature, boundingBox);

        // Recursively find the best position
        this._insert(this.root, newLeafNode)
    }

    private _insert (currentNode: InternalNode, newNode: LeafNode): void {
        // Before inserting in the child of the current node. Update the current
        // node's bounding box.
        currentNode.boundingBox.extendBoundingBoxForBoundingBox(newNode.boundingBox);

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
                area: node.boundingBox.getBoundingBoxAreaIfExtended(newNode.boundingBox)
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

    public import (geoJson: geojson.FeatureCollection): void {
        // TODO: Sorting can have performance imporovements;
        // geoJson.features.sort((aFeature, bFeature) => {
        //     const x1 = aFeature.geometry.coordinates[0];
        //     const x2 = bFeature.geometry.coordinates[0];
        //     if (x1 < x2) {
        //         return -1;
        //     } else if (x1 > x2) {
        //         return 1;
        //     }
        //     return 0;
        // });

        // Insert all points.
        geoJson.features.forEach(feature => {
            this.insert(feature);
        })
    }
}
