import './list.scss';
import React, { Component } from 'react';
import { Pagination } from 'views/components';
import { ListItem } from './list-item';
import { string, bool, number, object, any, array, func } from 'prop-types';

class List extends Component {

    static defaultProps = {
        className: '',
        itemsPerPage: 10,
        hideNav: false,
        hideCount: false,
        countText: 'Items Found',
        showEmpty: true,
        emptyMessage: 'No data to display.',
        loadMoreOnScroll: false,
    }

    static propTypes = {

        hideNav: bool,
        showEmpty: bool,
        className: string,
        style: object,
        itemsPerPage: number,

        itemHeight: number,
        itemWidth: number,
        itemGap: number,

        hideCount: bool,
        countText: string,
        countStyle: object,
        header: any,
        data: array,
        onItemClick: func,

        selectedItem: string,
    }

    state = {
        data: null,
        loading: false,
    }

    componentDidMount() {
        this.setState({
            data: this.props.data,
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            data: newProps.data,
        });
    }

    renderMain = (data, itemsPerPage, hideNav) => {

        const { itemHeight, itemWidth, itemGap, onItemClick, showEmpty, emptyMessage, selectedItem, selectedColor, loadMoreOnScroll, root } = this.props;

        let itemCodePrefix;
        let children = [];

        if (data && data.length > 0) {
            
            children = data.map((item, index) => {
                
                itemCodePrefix = item.layout && item.layout.key && root ? item.layout.key.substr(0, 3) : (item.code ? item.code.substr(0, 3) : null);
                itemCodePrefix && console.log(root, item);
                return (
                <ListItem 
                    isSelected={selectedItem == item.code} 
                    {...item} 
                    key={index} 
                    itemGap={itemGap} 
                    itemWidth={itemWidth} 
                    itemHeight={itemHeight} 
                    onClick={onItemClick} 
                    selectedColor={selectedColor}
                />);
            });
        }
        else {
            if(showEmpty === true) {
                children = [
                    <div className='list-empty' style={{ 'marginTop': '20px' }}>{emptyMessage}</div>
                ];
            }
        }

        console.log(root, itemCodePrefix);

        return (
            <Pagination perPage={itemsPerPage} hideNav={hideNav} loadMoreOnScroll={data && data.length > 0 && loadMoreOnScroll} root={root} itemCodePrefix={itemCodePrefix || 'BEG'}>
                {children}
            </Pagination>
        );
    }

    renderCount = (data, countText, countStyle) => {
        
        if (data && data.length > 0) {
            return (
                <div className='list-count' style={{ ...countStyle }}>
                    <span>{data.length} {countText}</span>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {

        const { className, style, itemsPerPage, header, hideNav, hideCount, countText, countStyle } = this.props;
        const { data } = this.state;
        const componentStyle = { ...style, };

        const renderMain = this.renderMain(data, itemsPerPage, hideNav);
        const renderCount = this.renderCount(data, countText, countStyle);

        return (
            <div className={`list ${className}`} style={componentStyle}>
                {
                    header ?
                    <div className='list-header'>
                        { header }
                    </div>
                    : null
                }
                { hideCount ? null : renderCount }
                <div className="list-main" onScroll={this.handleScroll} >
                    { renderMain }
                </div>
            </div>
        );
    }
}

export default List;
