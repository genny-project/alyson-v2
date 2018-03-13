import './list.scss';
import React, { Component } from 'react';
import { Pagination } from 'views/components';
import { ListItem } from './list-item';
import { string, bool, number, object, any, array, func } from 'prop-types';

class List extends Component {

    static defaultProps = {
        className: '',
        itemsPerPage: 4,
        hideNav: false,
        hideCount: false,
        countText: 'Items Found',
    }

    static propTypes = {
        hideNav: bool,
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
        onItemClick: func
    }

    state = {
        data: null
    }

    componentDidMount() {
        this.setState({
            data: this.props.data
        });
    }

    componentWillReceiveProps(newProps) {
        // console.log(newProps.data);
        this.setState({
            data: newProps.data,
        });
    }

    renderMain = (data, itemsPerPage, hideNav) => {
        const { itemHeight, itemWidth, itemGap, onItemClick } = this.props;
        
        let children = [];
        if (data && data.length > 0) {
            children = data.map((item, index) => {
                // console.log('----------------');
                // console.log(item);
                return <ListItem {...item} key={index} itemGap={itemGap} itemWidth={itemWidth} itemHeight={itemHeight} onClick={onItemClick}/>;
            });
        }
        else {
            children = [
                <div className='list-empty'>No data to display.</div>
            ];
        }
        return (
            <Pagination perPage={itemsPerPage} hideNav={hideNav} >
                {children}
            </Pagination>
        );
        // if (data && data.length > 0) {
        //     <Pagination perPage={itemsPerPage} hideNav={hideNav} >
        //         {
        //             data.map((item, index) => {
        //                 return <ListItem {...item} key={index} itemGap={itemGap} itemWidth={itemWidth} itemHeight={itemHeight} onClick={onItemClick}/>;
        //             })
        //         }
        //     </Pagination>;
        // }
        // else {
        //     <div className='list-empty'>No data to display.</div>;
        // }
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
                <div className="list-main">
                    { renderMain }
                </div>
            </div>
        );
    }
}

export default List;
