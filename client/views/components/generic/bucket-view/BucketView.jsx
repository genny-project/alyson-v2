import './bucketView.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BucketColumn } from './bucket-column';

const grid = 5;
const getItemStyle = (draggableStyle, isDragging) => ({

    userSelect: 'none',
    padding: grid * 2,
    marginBottom: grid,

    // styles we need to apply on draggables. This is mandatory.
    ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'lightblue' : "#a3a3a3",
    padding: grid,
});

class BucketView extends Component {

    constructor(props) {
        super(props);
    }

    onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        console.log(result);
    }

    render() {

        const { buckets, style } = this.props;

        return (

            <DragDropContext onDragEnd={this.onDragEnd}>

                <div className="bucket-view" style={style}>
                    {
                        buckets.map((bucket) => {

                            console.log(BucketColumn);
                            return (
                                <BucketColumn title={bucket.title} children={bucket.children} />
                            )
                        })
                    }
                </div>
            </DragDropContext>

        );
    }
}

export default BucketView;
