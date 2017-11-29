import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BucketColumn } from './bucket-column';
import { Modal, List } from 'views/components';
import _ from 'lodash';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './bucketView.scss';

class BucketView extends Component {

    state = {
        buckets: [],
        touch: {},
        touchTimer: null,
        currentlySelectedItem: false,
    }

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(newProps, newState) {

        if(newProps.buckets && this.state.buckets) {
            if(!_.isEqual(newProps.buckets, this.state.buckets) && newProps.buckets.length == this.state.buckets.length) {
                console.log("NOT RENDERING. ANIMATING.");
                console.log(newProps.buckets);
            }
        }

        return true;
    }

    componentWillUpdate(props) {
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

                if(buckets[i].children.length == 0) {
                    buckets[i].children.push(item);
                }
                else {
                    buckets[i].children.splice(destinationIndex, 0, item);
                }

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

    scrollToBucket = (positionBucket) => {

        let bucket = ReactDOM.findDOMNode(this);
        let bucketTotalWidth = bucket.scrollWidth;
        let bucketPageWidth = bucket.getBoundingClientRect().width;
        let currentScrollPosition = bucket.scrollLeft;
        let new_position = currentScrollPosition;

        if(positionBucket == "next") {

            if(currentScrollPosition + bucketPageWidth <= bucketTotalWidth) {
                new_position = currentScrollPosition + bucketPageWidth;
            }
        }
        else if(positionBucket == "previous") {

            if(currentScrollPosition - bucketPageWidth >= 0) {
                new_position = currentScrollPosition - bucketPageWidth;
            }
        }

        bucket.scrollTo({
            "behavior": "smooth",
            "left": new_position
        });
    }

    goToNextBucket = () => {
        this.scrollToBucket("next");
    }

    goToPreviousBucket = () => {
        this.scrollToBucket("previous");
    }

    toggleMovingOptions = (item) => {

        this.setState({
            currentlySelectedItem: item
        });
    }

    addNewItem = (selectedColumn) => {

        let groupId = selectedColumn.props.groupId;
        if(this.props.addNewItem) {
            this.props.addNewItem(groupId);
        }
    }

    mobileMoveItem = (item, bucketDestination) => {

        // we find the original bucket
        let itemCode = item.props.description;
        let draggedItem = {
            draggableId: itemCode,
        };

        let destinationBucket = {
            droppableId: bucketDestination.id,
            index: -1,
        }

        let sourceBucket = {
            droppableId: null,
            index: -1,
        };

        for (var i = 0; i < this.state.buckets.length; i++) {

            let bucket = this.state.buckets[i];

            if(bucket.id == bucketDestination.id) {
                destinationBucket.index = bucket.children.length;
            }

            for (var j = 0; j < bucket.children.length; j++) {

                let children = bucket.children[j];
                if(children.id == itemCode) {
                    sourceBucket.droppableId = bucket.id;
                    sourceBucket.index = j;
                    break;
                }
            }

            if(sourceBucket.index > -1 && destinationBucket.index > -1) {
                break; // sourceBucket and destinationBucket were found, not need to loop anymore.
            }
        }

        // simulate dragging
        if(this.props.didMoveItem) {
            this.props.didMoveItem(draggedItem, sourceBucket, destinationBucket);
        }
        this.didMoveItem(draggedItem, sourceBucket, destinationBucket);
        this.toggleMovingOptions();
    }

    bucketSelectionLayout = (item) => {

        return (
            <List itemsPerPage={this.state.buckets.length}>
                {
                    this.state.buckets.map(bucket => <div className={`bucket-option-item size-${this.props.screenSize}`} onClick={() => this.mobileMoveItem(item, bucket)}>{bucket.title}</div>)
                }
            </List>
        );
    }

    render() {

        const { style } = this.props;
        const { buckets, currentlySelectedItem } = this.state;

        let columns = buckets.map((bucket) =>

                <BucketColumn
                    screenSize={this.props.screenSize}
                    title={bucket.title}
                    key={bucket.id}
                    groupId={bucket.id}
                    items={bucket.children}
                    goToNextBucket={this.goToNextBucket}
                    goToPreviousBucket={this.goToPreviousBucket}
                    showMovingOptions={this.toggleMovingOptions}
                    addNewItem={this.addNewItem}
                    canAddItem={bucket.canAddItem}
                    />
                )

        return (
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                <div className={`bucket-view size-${this.props.screenSize}`}>
                    <Modal header={<div>Move to</div>} onClose={this.toggleMovingOptions} show={currentlySelectedItem}>
                        <div>{this.bucketSelectionLayout(currentlySelectedItem)}</div>
                    </Modal>
                    {columns}
                </div>
            </DragDropContext>
        )
    }
}

export default BucketView;
