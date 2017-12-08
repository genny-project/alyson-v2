import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BucketColumn } from './bucket-column';
import { Modal, List, Device } from 'views/components';
import _ from 'lodash';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './bucketView.scss';

class BucketView extends Component {

    state = {
        buckets: this.props.buckets || [],
        currentlySelectedItem: false,
        touch: {}
    }

    getBucketColumnContentNode(bucket) {

        const index_bucket = this.state.buckets.indexOf(bucket);
        const bucketNode = ReactDOM.findDOMNode(this);
        if(index_bucket && bucketNode) {

            let destinationBucketNode = bucketNode.children[index_bucket];
            return destinationBucketNode.getElementsByClassName('bucket-content')[0]
        }
    }

    getAvailableSpotRectInBucket(elementSize, destinationBucket) {

        let bucketContentNode = this.getBucketColumnContentNode(destinationBucket);
        if(bucketContentNode) {

            let contentSize = bucketContentNode.getBoundingClientRect();
            let number_of_children = bucketContentNode.children.length;

            if(contentSize) {
                contentSize.y += contentSize.height;
            }

            return contentSize;
        }

        return null;
    }

    animateItem = (item, sourceBucket, destinationBucket) => {

        let sourceBkt = this.state.buckets.filter(x => x.title == sourceBucket.title)[0];
        let destinationBkt = this.state.buckets.filter(x => x.title == destinationBucket.title)[0];
        if(sourceBkt && destinationBkt) {

            let child = sourceBkt.children.filter(x => x.id == item.id)[0];
            if(child) {

                // we calculate the X and Y in destination.
                let childIndex = sourceBkt.children.indexOf(child);
                let sourceBucketNode = this.getBucketColumnContentNode(sourceBkt);
                if(sourceBucketNode && sourceBucketNode.children) {

                    const originSpot = sourceBucketNode.children[childIndex] ? sourceBucketNode.children[childIndex].getBoundingClientRect() : null;

                    if(originSpot) {

                        const destinationSpot = this.getAvailableSpotRectInBucket(originSpot, destinationBkt);
                        if(destinationSpot) {

                            const xDestination = destinationSpot.x - originSpot.x;
                            const yDestination = destinationSpot.y - originSpot.y;

                            child.style = {
                                transition: "0.5s all",
                                WebkitTransition: "0.5s all",
                                transform: `translate(${xDestination}px, ${yDestination}px)`,
                                WebkitTransform: `translate(${xDestination}px, ${yDestination}px)`,
                                position: 'absolute',
                            }
                        }
                    }
                }
            }
        }
    }

    componentWillUpdate(newProps, newState) {

        // we should allow auto re rendering as often as possible. However, if an item was moved from one bucket to another, we want to apply
        // a transformation instead of re rendering the whole bucket.

        // TODO: uncomment to remove animation.
        // this.state.buckets = newProps.buckets;
        // return;

        if(newProps.buckets && this.state.buckets && newProps.buckets.length == this.state.buckets.length && newProps.buckets.length > 0 && !this.hasDraggedItem) {

            let differences = [];
            for (var i = 0; i < newProps.buckets.length; i++) {

                let newBucket = newProps.buckets[i];
                let oldBucket = this.state.buckets[i];

                if(newBucket.children && oldBucket.children) {
                    differences.push({
                        difference: oldBucket.children.differences(newBucket.children),
                        source: oldBucket
                    });
                }
            }

            // we loop through the differences to see if an item when from a "delete" array to a "added" array.
            let movedItems = [];
            for (var i = 0; i < differences.length; i++) {

                let currentDifference = differences[i];
                currentDifference.difference.deleted.forEach(deletedItem => {

                    // we found an item that has been deleted.
                    // we loop through the items again to see if the same item has been "added" in another difference
                    // which would mean the item has been moved.
                    for (var j = 0; j < differences.length; j++) {

                        let searchDifference = differences[j];
                        let items = searchDifference.difference.added.filter(y => _.isEqual(y, deletedItem));
                        if(items.length > 0) {

                            items.forEach(item => {
                                movedItems.push({
                                    source: currentDifference.source,
                                    destination: searchDifference.source,
                                    item: item
                                });
                            })
                        }
                    }
                })
            }

            if(movedItems.length > 0) {

                // for now this code only handle 1 item animation and then re-render the bucket.
                for (var i = 0; i < movedItems.length; i++) {
                    this.animateItem(movedItems[i].item, movedItems[i].source, movedItems[i].destination);
                }

                setTimeout(() => {

                    this.setState({
                        buckets: newProps.buckets,
                        hasDraggedItem: false,
                    })
                }, 600)

                return;
            }
        }

        this.state.buckets = newProps.buckets;
        this.hasDraggedItem = false;
        return;
    }

    onDragEnd = (result) => {

        // dropped outside the list
        if (!result.destination) {
            return;
        }

        this.didMoveItem(result, result.source, result.destination);

        if(this.props.didMoveItem) {
            this.props.didMoveItem(result, result.source, result.destination);
        }
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

        this.hasDraggedItem = true;

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

    onTouchMove = (e) => {

        if(e.touches && e.touches.length > 0) {

            let touch = e.touches[0];

            let deltaX = touch.clientX - this.state.touch.clientX;
            this.state.touch.clientX = touch.clientX;
            this.state.touch.deltaX = deltaX;
            this.state.touch.isMoving = true;
        }
    }

    onTouchEnd = () => {

        if(this.state.touch.isMoving) {

            let deltaX = this.state.touch.deltaX;
            this.state.touch = {};
            if(deltaX < 0) {
                this.goToNextBucket();
            }
            else {
                this.goToPreviousBucket();
            }
        }
    }

    render() {

        const { style } = this.props;
        const { buckets, currentlySelectedItem } = this.state;

        let columns = buckets.map((bucket, index) =>

            <BucketColumn
                screenSize={this.props.screenSize}
                title={bucket.title}
                key={bucket.id}
                groupId={bucket.id}
                items={bucket.children}
                goToPreviousBucket={ index == 0 ? false : this.goToPreviousBucket}
                goToNextBucket={ index == buckets.length - 1 ? false : this.goToNextBucket}
                showMovingOptions={this.toggleMovingOptions}
                addNewItem={this.addNewItem}
                canAddItem={bucket.canAddItem}
                className={(index % 2 == 0) ? '' : 'alt-style'}
                />
        )

        return (
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                <div onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd} className={`bucket-view size-${window.getScreenSize()}`}>
                    <Device isMobile>
                        <Modal header={<div>Move to</div>} onClose={this.toggleMovingOptions} show={currentlySelectedItem}>
                            <div>{this.bucketSelectionLayout(currentlySelectedItem)}</div>
                        </Modal>
                    </Device>
                    {columns}
                </div>
            </DragDropContext>
        )
    }
}

export default BucketView;
