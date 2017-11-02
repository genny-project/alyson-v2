import './BucketColumn.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { BucketElement } from './bucket-element';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const gridPadding = 5;
const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'lightblue' : "#a3a3a3",
    padding: gridPadding,
});

class BucketColumn extends Component {

    static defaultProps = {
        className: '',
        title: 'Bucket',
        groupId: '',
    }

    static propTypes = {
        className: string,
        style: string,
        children: object,
        title: string,
        groupId: string,
    }

    state = {
    }

    render() {

        const { className, style, title, children, groupId } = this.props;
        const {  } = this.state;
        const componentStyle = { ...style, };

        return (

            <Droppable droppableId={groupId}>
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
                                    children.map(child => (<BucketElement item={child} />))
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
