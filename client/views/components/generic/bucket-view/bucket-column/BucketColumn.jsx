import './BucketColumn.scss';
import React, { Component } from 'react';
import { string, object, func, array, bool, any } from 'prop-types';
import { BucketElement } from './bucket-element';
import { Droppable } from 'react-beautiful-dnd';
import { GennyBridge } from 'utils/genny';
import { IconSmall, Status, Dropdown } from 'views/components';
import { Grid } from '@genny-project/layson';
import { finalize } from 'rxjs/operators';

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
        isOpen: false,
        sort: 'asc',
    }

    // shouldComponentUpdate() {
    //     return true;
    // }

    moveBucket = (notification) => {
        if(notification == 'previous') this.props.goToPreviousBucket();
        if(notification == 'next') this.props.goToNextBucket();
    }

    // addNewItem = () => {

    //     if(this.props.addNewItem) {
    //         this.props.addNewItem(this);
    //     }
    // }

    onExpandColumn = (code) => {

        GennyBridge.sendTVEvent('TV_SELECT', {
          code: 'TV1',
          value: code
        }, code);
    }

    sortItems = (items) => {
        const { sort } = this.state;

        let sortedItems = [];

        const sortByStatus = ( items ) => {
            
            let statusItems = items.filter(item => item.content.status != null).sort((x, y) => x.content.status > y.content.status);
            let weightItems = items.filter(item => item.content.status == null).sort((x, y) => x.content.weight > y.content.weight);
            let finalItems = statusItems.concat(weightItems);

            /* first we sort the status items */
            return finalItems;
        };

        sortedItems = sortByStatus( items );

        return sortedItems;
    }

    renderContent = (provided) => {
        const { title, items, showMovingOptions, onClick } = this.props;
       
        return (
            <div ref={provided && provided.innerRef}
                //style={getListStyle(snapshot.isDraggingOver)}
                className={`bucket size-${window.getScreenSize()}`}
                key={title} >

                <div className={`bucket-content size-${window.getScreenSize()} no-select`}>
                    {
                        this.sortItems(items).map((child, index) => {
                            return (
                                <BucketElement
                                key={child.id}
                                item={child}
                                style={child.style}
                                moveBucket={this.moveBucket}
                                screenSize={window.getScreenSize()}
                                showMovingOptions={showMovingOptions}
                                index={index}
                                onClick={onClick}
                            />
                            );
                        })
                    }
                </div>

                { provided && provided.placeholder}

            </div>
        );
    }

    handleClick = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }


    handleBlur = () => {
        this.setState({
            isOpen: false
        });
    }

    handleSort = () => {
        const { sort } = this.state;
        
        if (sort == 'desc') {
            this.setState({
                sort: 'asc'
            });
        }
        else if (sort == 'asc') {
            this.setState({
                sort: 'desc'
            });
        }
    }

    render() {

        const { className, style, title, groupId, goToPreviousBucket, goToNextBucket, items, legend} = this.props;
        const { sort } = this.state;
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
                <IconSmall
                    style={{
                        cursor: 'pointer',
                    }}
                    name='list'
                    onClick={() => this.onExpandColumn(this.props.groupId)}
                />
                <span>{title}{ items && items.length ? ` (${items.length})` : null }</span>
                <IconSmall
                    style={{
                        cursor: 'pointer',
                        transform: `scale(1, ${sort == 'desc' ? '-' : ''}1`
                    }}
                    onClick={this.handleSort}
                    name='sort'
                />
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
                <IconSmall
                    style={{
                        marginRight: 'auto',
                        cursor: 'pointer',
                    }}
                    name='list'
                    onClick={() => this.onExpandColumn(this.props.groupId)}
                />
                <div style={{display: 'flex', alignItems: 'center'}} >
                    <span>{title}{ items && items.length ? ` (${items.length})` : null }</span>
                </div>
                <IconSmall
                    style={{
                        marginLeft: 'auto',
                        cursor: 'pointer',
                        transform: `scale(1, ${sort == 'desc' ? '-' : ''}1`
                    }}
                    onClick={this.handleSort}
                    name='sort'
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

                { legend.red || legend.orange || legend.green ?
                    <div className="bucket-legend sticky" onClick={this.handleClick} >
                        <Dropdown
                            className="bucket-legend-content"
                            open={this.state.isOpen}
                            isSlide={false}
                            onBlur={this.handleBlur}
                            tabIndex='-1'
                            animateHeader={false}
                            inline={true}
                            header={
                                <span style={{display: 'flex', alignItems: 'center', padding: `5px ${this.state.isOpen ? '5px 0' : ''}` }}>
                                    <h3>Status Legend</h3>
                                    <IconSmall
                                        name='arrow_drop_down'
                                        style={ this.state.isOpen ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' }}
                                    />
                                </span>
                            }
                        >
                            <Grid
                                style={{padding: '5px'}}
                                cols={[
                                    {style:{flexGrow: 1, display: 'flex', alignItems: 'center', marginRight: '10px',  justifyContent: 'center'}},
                                    '10px'
                                ]}
                                rows={[
                                    {style: {flexGrow: 1, paddingBottom: '5px'}},{style: {flexGrow: 1, paddingBottom: '5px'}},
                                    1
                                ]}
                            >
                                {legend.red ? <span position={[0,0]} style={{textAlign: 'center'}}>{legend.red}</span> : null }
                                {legend.red ? <Status position={[0,1]} color='urgent' style={{height: '15px' }}/> : null }
                                {legend.orange ? <span position={[1,0]} style={{textAlign: 'center'}}>{legend.orange}</span> : null }
                                {legend.orange ? <Status position={[1,1]} color='warning' style={{ height: '15px' }}/> : null }
                                {legend.green ? <span position={[2,0]} style={{textAlign: 'center'}}>{legend.green}</span> : null }
                                {legend.green ? <Status position={[2,1]} color='success' style={{ height: '15px' }}/> : null }
                            </Grid>
                        </Dropdown>
                    </div>
                : null }
            </div>
        );
    }
}

export default BucketColumn;