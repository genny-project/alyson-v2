import './BucketColumn.scss';
import React, { Component } from 'react';
import { string, object, any, bool } from 'prop-types';
import { BucketElement } from './bucket-element';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'lightblue' : "#a3a3a3",
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

        const { className, style, title, children, groupId, screenSize } = this.props;
        const componentStyle = { ...style, };

        return (

            <Droppable droppableId={groupId}>
                {
                    (provided, snapshot) => (

                        <div ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            className={`bucket size-${screenSize}`}
                            key={title} >

                            <div className="bucket-title sticky">
                                {title}
                            </div>
                            <div className="bucket-content no-select">
                                {
                                    children.map(child => (<BucketElement key={child.id} item={child} />))
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
