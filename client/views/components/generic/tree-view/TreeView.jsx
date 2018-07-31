import './treeView.scss';
import React, { Component } from 'react';
import { object, array, func, bool, oneOfType } from 'prop-types';
import { IconSmall } from 'views/components';
import { Fade, Slide, Scale } from 'views/utils/animations';

class TreeView extends Component {

    static defaultProps = {
        hideRootChildCount: true,
    }

    static propTypes = {
        style: object,
        items: array,
        data: object,
        onClick: func,
        onExpand: func,
        hideRootChildCount: bool,
    };

    state = {
        currentItem: null
    };

    onClick = (item) => (event) => {

        event.stopPropagation();
        event.preventDefault();

        this.setState({
            selectedItem: item.id
        });

        this.props.onClick(item);
        return false;
    }

    onExpand = (item) => (event) => {

        event.stopPropagation();
        event.preventDefault();

        this.props.onExpand(item);
        return false;
    }

    renderList = (items, levelIndex) => {

        return items.map( item => {

            // console.log(item);
            const hasChildren = ( item.children && Array.isArray( item.children ) && item.children.length > 0 );
            // console.log(hasChildren);
            const canOpen = ( hasChildren && item.open );
            // console.log(canOpen);
            const icon = item.icon;

            let childNumber = null;

            if ( !this.props.hideRootChildCount || ( this.props.hideRootChildCount && levelIndex > 0 ) ) {
                // console.log('childCounts', item.childCounts, 'childCount', item.childCount, 'children.length', item.children.length);
                childNumber = item.childCount ? item.childCount : false;
            }

            return (

                <li key={item.id} className='tree-view-item'>
                    <div className={`tree-view-item-content ${this.state.selectedItem == item.id ? 'tree-view-item-selected' : ''} `}>
                        <span
                            className={`tree-view-item-main clickable`} 
                            onClick={
                                // this.state.selectedItem == item.id
                                //     ? null
                                //     : this.onClick(item)
                                this.onClick(item)
                            }
                        >
                            { icon ? <IconSmall className='tree-view-icon main' name={icon} /> : null }
                            <span className='tree-view-text' style={!icon ? { marginLeft: '20px' } : {}}>{item.name}</span>
                        </span>
                        { childNumber && (
                            <span className='tree-view-item-count'>({childNumber})</span>
                        )}
                        {
                            ( item.children && item.children.length > 0 ) 
                                ? <IconSmall
                                        className={`tree-view-icon arrow clickable ${canOpen ? 'open' : 'close'} `}
                                        size={32}
                                        style={canOpen ? { transition: 'transform 0.1s', transform: 'rotate(0deg)' } : { transition: 'transform 0.1s', transform: 'rotate(-90deg)' }}
                                        onClick={this.onExpand(item)}
                                        name='arrow_drop_down'
                                />
                                : <div className="tree-view-item-spacer" />
                        }

                    </div>
                        {
                            item.children != null && item.children.length > 0
                                ? <div>
                                    <ul className="tree-view-child">
                                        <Slide inProp={canOpen} heightEntered={`${item.visibleChildren * 60}px`}>
                                            {this.renderList(item.children, levelIndex + 1)}
                                        </Slide>
                                    </ul>
                                </div>
                                : null
                        }
                </li>
            );
        });
    }

    render() {

        const { items } = this.props;

        return (
            <div className="treeview">
                <ul className="parent">
                    {this.renderList(items, 0)}
                </ul>
            </div>
        );
    }
}

export default TreeView;
