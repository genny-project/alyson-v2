import './bucketView.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
                        buckets.map((bucket) => (
                            <Droppable droppableId={bucket.title}>

                                {
                                    (provided, snapshot) => (
                                    <div ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                        className="bucket"
                                        key={bucket.title} >

                                        <div className="bucket-title sticky">
                                            {bucket.title}
                                        </div>
                                        <div className="bucket-content">
                                            {(bucket ? bucket.children : []).map(item => (

                                                <Draggable key={item.id} draggableId={item.id}>
                                                    {(provided, snapshot) => (
                                                        <div>
                                                            <div
                                                                ref={provided.innerRef}
                                                                style={getItemStyle(
                                                                    provided.draggableStyle,
                                                                    snapshot.isDragging
                                                                )}
                                                                {...provided.dragHandleProps}
                                                                className="bucket-contents"
                                                                >
                                                                    {item.content}
                                                                </div>
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </div>

                                            {provided.placeholder}

                                        </div>
                                    )
                                }

                            </Droppable>
                        ))
                    }
                </div>
            </DragDropContext>

        );
    }
}

export default BucketView;
