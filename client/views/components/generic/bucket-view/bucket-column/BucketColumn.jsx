import './BucketColumn.scss';
import React, { Component } from 'react';
import { string, object, func, array, bool } from 'prop-types';
import { BucketElement } from './bucket-element';
import { Droppable } from 'react-beautiful-dnd';
import { GennyBridge } from 'utils/genny';
import { IconSmall, Status, Button } from 'views/components';
import { Grid } from '@genny-project/layson';

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
        style: object,
        children: object,
        title: string,
        groupId: string,
        goToPreviousBucket: func,
        goToNextBucket: func,
        addNewItem: func,
        items: array,
        canAddItem: bool,
        showMovingOptions: func,
    }

    state = {
    }

    moveBucket = (notification) => {
        if(notification == 'previous') this.props.goToPreviousBucket();
        if(notification == 'next') this.props.goToNextBucket();
    }

    addNewItem = () => {

        if(this.props.addNewItem) {
            this.props.addNewItem(this);
        }
    }

    onExpandColumn = (code) => {

        GennyBridge.sendTVEvent('TV_SELECT', {
          code: 'TV1',
          value: code
        }, code);
    }

    render() {

        const { className, style, title, items, groupId, canAddItem, goToPreviousBucket, goToNextBucket, showMovingOptions } = this.props;
        let titleDiv = null;

        if(window.getScreenSize() == 'sm') {
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
            </div>;
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
                    <Button
                        style={ {'fontSize': '12px', 'width': '65px', 'cursor': 'pointer' } }
                        buttonStyle={{ 'background': 'white' }}
                        onClick={() => this.onExpandColumn(this.props.groupId)}
                    >
                        <span style={{color: 'rgb(130, 130, 130' }} >Expand</span>
                    </Button>
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
                                        items.map((child, index) => {

                                            return (
                                                <BucketElement
                                                key={child.id}
                                                item={child}
                                                style={child.style}
                                                moveBucket={this.moveBucket}
                                                screenSize={window.getScreenSize()}
                                                showMovingOptions={showMovingOptions}
                                                index={index}/>
                                            );
                                        })
                                    }
                                </div>

                                {provided.placeholder}

                            </div>
                        )
                    }

                </Droppable>

                <div className="bucket-legend sticky">
                    <Grid
                        style={{padding: '5px'}}
                        cols={['20px', {style:{flexGrow: 1, display: 'flex', alignItems: 'center'}}]}
                        rows={[{style: {flexGrow: 1, paddingBottom: '5px'}},{style: {flexGrow: 1, paddingBottom: '5px'}},1]}
                    >
                        <Status position={[0,0]} color='urgent' style={{height: '15px' }}/>
                        <span position={[0,1]} >Overdue. Immediate action required.</span>
                        <Status position={[1,0]} color='warning' style={{ height: '15px' }}/>
                        <span position={[1,1]} >Update. Action required.</span>
                        <Status position={[2,0]} color='success' style={{ height: '15px' }}/>
                        <span position={[2,1]} >No action required.</span>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default BucketColumn;
