import './BucketColumn.scss';
import React, { Component } from 'react';
import { string, object, func, array, bool, any } from 'prop-types';
import { BucketElement } from './bucket-element';
import { Droppable } from 'react-beautiful-dnd';
import { GennyBridge } from 'utils/genny';
import { IconSmall, Status, Button } from 'views/components';
import { Grid } from '@genny-project/layson';

// const getListStyle = isDraggingOver => ({
//     // background: isDraggingOver ? 'lightblue' : "#a3a3a3",
// });

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
        goToPreviousBucket: any,
        goToNextBucket: any,
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

    renderContent = (provided) => {
        const { title, items, showMovingOptions } = this.props;
        
        return (
            <div ref={provided && provided.innerRef}
                //style={getListStyle(snapshot.isDraggingOver)}
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

                { provided && provided.placeholder}

            </div>
        );
    }

    render() {

        const { className, style, title, groupId, canAddItem, goToPreviousBucket, goToNextBucket, } = this.props;
        let titleDiv = null;
        let isMobile = window.getScreenSize() == 'sm';

        if(isMobile) {
            titleDiv =
            <div>
                {
                    goToPreviousBucket ?
                        <IconSmall
                            className="clickable bucket_action_previous"
                            name='chevron_left'
                            onClick={this.props.goToPreviousBucket}
                            style={{
                                padding: '5px 0'
                            }}
                        />
                    : <div className='spacer prev'/>
                }
                <div style={{display: 'flex', alignItems: 'center'}} >
                {
                    canAddItem ?
                        <IconSmall className="clickable bucket_add" name='add_circle' text={title} onClick={this.addNewItem} />
                    : `${title}`
                }
                <IconSmall
                    style={{
                        marginLeft: '10px',
                        fontSize: '12px',
                        cursor: 'pointer',
                    }}
                    name='list'
                    onClick={() => this.onExpandColumn(this.props.groupId)}
                />
                </div>
                
                {
                    goToNextBucket ?
                        <IconSmall
                            className="clickable bucket_action_next"
                            name='chevron_right'
                            onClick={this.props.goToNextBucket}
                            style={{
                                padding: '5px 0'
                            }}
                        />
                    : <div className='spacer next'/>
                }
            </div>;
        }
        else {
            titleDiv =
            <div style={{ justifyContent: 'space-between'}}>
                {
                    canAddItem ? <IconSmall className="clickable bucket_add" name='add_circle' onClick={this.addNewItem} /> : <div style={{ marginRight: '5px'}} />
                }
                <span>{title}</span>
                <IconSmall
                    style={{
                        marginLeft: 'auto',
                        fontSize: '12px',
                        cursor: 'pointer',
                    }}
                    name='list'
                    onClick={() => this.onExpandColumn(this.props.groupId)}
                />
            </div>;
        }

        return (

            <div className={`bucket-column ${className}`} style={style}>
                <div className="bucket-title sticky">
                    {titleDiv}
                </div>

                { 
                    isMobile ?
                    this.renderContent() :
                    <Droppable droppableId={groupId}>
                        {(provided) => (
                            this.renderContent(provided)
                        )}
                    </Droppable>
                }
                

                <div className="bucket-legend sticky">
                    <div className="bucket-legend-content">
                        <h3>Action Legend</h3>
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
            </div>
        );
    }
}

export default BucketColumn;
