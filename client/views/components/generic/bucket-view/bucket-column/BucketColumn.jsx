import './BucketColumn.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from '../';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class BucketColumn extends Component {

    static defaultProps = {
        className: '',
        title: 'Bucket'
    }

    static propTypes = {
        className: string,
        style: string,
        children: object,
        title: string
    }

    state = {
    }

    render() {

        const { className, style, title, children } = this.props;
        const {  } = this.state;
        const componentStyle = { ...style, };

        return (
            <Droppable droppableId={title}>

                {
                    (provided, snapshot) => (
                        <div ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            className="bucket"
                            key={title} >

                            <div className="bucket-title sticky">
                                {title}
                            </div>
                            <div className="bucket-content">
                                {
                                    children.map(child => (

                                        <Draggable key={child.id} draggableId={child.id}>
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
                                                            {child.content}
                                                        </div>
                                                        {provided.placeholder}
                                                    </div>
                                            )}
                                        </Draggable>
                                    ))
                                }
                                </div>

                            {provided.placeholder}

                        </div>
                    )
                }

            </Droppable>
        );
    }
}

export default BucketColumn;
