import './BucketColumn.scss';
import React, { Component } from 'react';
import { string, object, any, bool } from 'prop-types';
import { BucketElement } from './bucket-element';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { IconSmall } from 'views/components';

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

    moveBucket = (notification) => {
        if(notification == "previous") this.props.goToPreviousBucket()
        if(notification == "next") this.props.goToNextBucket()
    }

    render() {

        const { className, style, title, items, groupId, screenSize } = this.props;
        const componentStyle = { ...style, };

        let titleDiv = null;
        if(screenSize == "xs") {
            titleDiv =
            <div>
                <IconSmall className="bucket_action_previous" name='chevron_left' onClick={this.props.goToPreviousBucket}/>
                    <span>{title}</span>
                <IconSmall className="bucket_action_next" name='chevron_right' onClick={this.props.goToNextBucket}/>
            </div>
        }
        else {
            titleDiv = title;
        }

        return (

            <Droppable droppableId={groupId}>
                {
                    (provided, snapshot) => (

                        <div ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            className={`bucket size-${screenSize}`}
                            key={title} >

                            <div className="bucket-title sticky">
                                {titleDiv}
                            </div>
                            <div className={`bucket-content size-${screenSize} no-select`}>
                                {
                                    items.map(child => (
                                        <BucketElement
                                        key={child.id}
                                        item={child}
                                        moveBucket={this.moveBucket}
                                        screenSize={screenSize}
                                        showMovingOptions={this.props.showMovingOptions} />
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
