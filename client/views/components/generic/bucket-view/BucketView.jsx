import './bucketView.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BucketColumn } from './bucket-column';

class BucketView extends Component {

    state = {
        buckets: [],
    }

    constructor(props) {
        super(props);
        this.state.buckets = props.buckets;
    }

    onDragEnd = (result) => {

        // dropped outside the list
        if (!result.destination) {
            return;
        }

        if(this.props.didMoveItem) {
            this.props.didMoveItem(result, result.source, result.destination);
        }

        this.didMoveItem(result, result.source, result.destination);
    }

    moveItemInDifferentBucket = (itemCode, sourceBucketCode, destinationBucketCode, originalIndex, destinationIndex) => {

        let buckets = this.state.buckets;
        let item = null;

        for (var i = 0; i < buckets.length; i++) {
            if(buckets[i].id == sourceBucketCode) {
                item = buckets[i].children[originalIndex];
                buckets[i].children.splice(originalIndex, 1);
                break;
            }
        }

        for (var i = 0; i < buckets.length; i++) {
            if(buckets[i].id == destinationBucketCode) {
                buckets[i].children.splice(destinationIndex, 0, item);
                break;
            }
        }

        this.setState({ buckets: buckets });
    }

    moveItemInBucket = (itemCode, bucketCode, originalIndex, destinationIndex) => {

        // find bucket and reorder items.
        let bucket = this.state.buckets.filter(bucket => bucket.id == bucketCode)[0];
        bucket.children.swap(originalIndex, destinationIndex);
    }

    didMoveItem = (item, source, destination) => {

        if(source.droppableId == destination.droppableId) {
            this.moveItemInBucket(item.draggableId, source.droppableId, source.index, destination.index);
        }
        else {
            this.moveItemInDifferentBucket(item.draggableId, source.droppableId, destination.droppableId, source.index, destination.index);
        }
    }

    render() {

        const { style } = this.props;
        const { buckets } = this.state;

        return (

            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="bucket-view" style={style}>
                    {
                        buckets.map((bucket) => <BucketColumn title={bucket.title} key={bucket.id} groupId={bucket.id} children={bucket.children} />)
                    }
                </div>
            </DragDropContext>

        );
    }
}

export default BucketView;
