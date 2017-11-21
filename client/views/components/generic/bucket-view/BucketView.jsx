import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BucketColumn } from './bucket-column';
import { Dropdown } from 'views/components';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './bucketView.scss';

class BucketView extends Component {

    state = {
        buckets: [],
        touch: {},
        touchTimer: null,
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

    onDragStart(e) {
        console.log(e);
    }

    toggleMovingOptions = (item) => {

        this.setState({
            showMovingOptions: this.state.showMovingOptions
        })
    }

    render() {

        const { style } = this.props;
        const { buckets, showMovingOptions } = this.state;

        let columns = buckets.map((bucket) => {

            return <BucketColumn
                        screenSize={this.props.screenSize}
                        title={bucket.title}
                        key={bucket.id}
                        groupId={bucket.id}
                        items={bucket.children}
                        goToNextBucket={this.goToNextBucket}
                        goToPreviousBucket={this.goToPreviousBucket}
                        showMovingOptions={this.toggleMovingOptions}
                        />
        })

        let dropdownStyle = {
            position: "absolute",
            left: "0px",
            background: "red"
        };

        return (
            <span>
                {
                    showMovingOptions ?
                    <Dropdown style={dropdownStyle}>
                        <ul className="bucket-options">
                          <li>Move</li>
                          <li>Cancel</li>
                        </ul>
                    </Dropdown> : null
                }
                <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                    <div className={`bucket-view size-${this.props.screenSize}`}>
                        {columns}
                    </div>
                </DragDropContext>
            </span>
        )
    }
}

export default BucketView;
