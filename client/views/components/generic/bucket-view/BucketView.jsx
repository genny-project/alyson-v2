import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BucketColumn } from './bucket-column';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './bucketView.scss';

class BucketView extends Component {

    state = {
        buckets: [],
        touch: {}
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

    onTouchStart = (e) => {

        this.state.touch = {};
        var t = e.touches[0];
        this.state.touch.sX = t.screenX;
        this.state.touch.sY = t.screenY;
    }

    onTouchMove = (e) => {

        var t = e.touches[0];
        this.state.touch.eX = t.screenX;
        this.state.touch.eY = t.screenY;
    }

    onTouchEnd = (e) => {

        let bucket = ReactDOM.findDOMNode(this);
        let bucketWidth = bucket.getBoundingClientRect().width;
        let min_x = bucketWidth / 2.0;
        var t = e.changedTouches[0];
        let deltaX = Math.abs(this.state.touch.sX - this.state.touch.eX);
        if(deltaX >= min_x) {

            if(this.state.touch.sX - this.state.touch.eX < 0) {
                bucket.scrollLeft = this.state.touch.eX - bucketWidth;
            }
            else {
                bucket.scrollLeft = this.state.touch.eX + bucketWidth;
            }
        }
        else {

            bucket.scrollLeft = this.state.touch.eX;
        }
    }

    render() {

        const { style } = this.props;
        const { buckets } = this.state;

        let columns = buckets.map((bucket) => <BucketColumn
                                    screenSize={this.props.screenSize}
                                    title={bucket.title}
                                    key={bucket.id}
                                    groupId={bucket.id}
                                    children={bucket.children} />)

        let columnWrapper = null;
        if(this.props.screenSize == "xs") {
            columnWrapper = <Carousel width={'100vw'}>{columns}</Carousel>;
        }
        else {
            columnWrapper = columns
        }

        console.log(columnWrapper);
        
        return (

            <DragDropContext onDragEnd={this.onDragEnd}>
                <div
                    className="bucket-view"
                    style={{width: '100vw'}}
                    onTouchMove={this.onTouchMove}
                    onTouchStart={this.onTouchStart}
                    onTouchEnd={this.onTouchEnd}>

                    {columnWrapper}

                </div>
            </DragDropContext>

        )
    }
}

export default BucketView;
