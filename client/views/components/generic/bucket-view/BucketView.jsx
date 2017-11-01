import './bucketView.scss';
import React, { Component } from 'react';
import { array, object, any } from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class BucketView extends Component {

    static propTypes = {
        buckets: array,
        style: object,
        children: any,
    };

    onDragEnd(result) {

    if (!result.destination) {
      return;
    }

    console.log(result);
  }

    renderBucket(bucket) {

        return (
            <div key={bucket.title} className="bucket-contents">
                {bucket.children}
            </div>
        );
    }

    render() {

        const { buckets, style } = this.props;

        return (
            <div className="bucket-view" style={style}>
                {
                    buckets.map(( bucket, i ) => (

                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => {

                                    <div className="bucket" key={bucket.title} ref={provided.innerRef}>
                                        <div className="bucket-title sticky">
                                            {bucket.title}
                                        </div>
                                        <div className="bucket-content">
                                            {this.renderBucket(bucket)}
                                        </div>
                                    </div>
                                }}
                            </Droppable>
                        </DragDropContext>
                    ))
                }
            </div>
        );
    }
}

export default BucketView;
