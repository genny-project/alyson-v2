import './bucketView.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BucketColumn } from './bucket-column';

class BucketView extends Component {

    constructor(props) {
        super(props);
    }

    onDragEnd = (result) => {

        // dropped outside the list
        if (!result.destination) {
            return;
        }

        if(this.props.didMoveItem) {
            this.props.didMoveItem(result, result.source, result.destination);
        }
    }

    render() {

        const { buckets, style } = this.props;

        return (

            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="bucket-view" style={style}>
                    {
                        buckets.map((bucket) => <BucketColumn title={bucket.title} groupId={bucket.id} children={bucket.children} />)
                    }
                </div>
            </DragDropContext>

        );
    }
}

export default BucketView;
