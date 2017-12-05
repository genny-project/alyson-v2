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

    addNewItem = () => {

        if(this.props.addNewItem) {
            this.props.addNewItem(this);
        }
    }

    render() {

        const { className, style, title, items, groupId, canAddItem, goToPreviousBucket, goToNextBucket } = this.props;
        const componentStyle = { ...style, };
        console.log();
        let titleDiv = null;
        if(window.getScreenSize() == "sm") {
            titleDiv =
            <div>
                {
                    goToPreviousBucket ?
                        <IconSmall className="clickable bucket_action_previous" name='chevron_left' onClick={this.props.goToPreviousBucket}/>
                    : <div className='spacer prev'/>
                }
                {
                    canAddItem ?
                        <IconSmall className="clickable bucket_add" name='add_circle' text={title} onClick={this.addNewItem} />
                    : `${title}`
                }
                {
                    goToNextBucket ?
                        <IconSmall className="clickable bucket_action_next" name='chevron_right' onClick={this.props.goToNextBucket}/>
                    : <div className='spacer next'/>
                }
            </div>
        }
        else {
            titleDiv =
            <div>
                {
                    canAddItem ? <IconSmall className="clickable bucket_add" name='add_circle' text={title} onClick={this.addNewItem} /> : `${title}`
                }
            </div>;
        }

        return (

            <div className={`bucket-column ${className}`} style={style}>
                <div className="bucket-title sticky">
                    {titleDiv}
                </div>

                <Droppable droppableId={groupId}>
                    {
                        (provided, snapshot) => (

                            <div ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                className={`bucket size-${window.getScreenSize()}`}
                                key={title} >

                                <div className={`bucket-content size-${window.getScreenSize()} no-select`}>
                                    {
                                        items.map(child => {

                                            return (
                                                <BucketElement
                                                key={child.id}
                                                item={child}
                                                style={child.style}
                                                moveBucket={this.moveBucket}
                                                screenSize={window.getScreenSize()}
                                                showMovingOptions={this.props.showMovingOptions} />
                                            )
                                        })
                                    }
                                </div>

                                {provided.placeholder}

                            </div>
                        )
                    }

                </Droppable>
            </div>
        );
    }
}

export default BucketColumn;
