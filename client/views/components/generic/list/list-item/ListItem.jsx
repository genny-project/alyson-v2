import './listItem.scss';
import React, { Component } from 'react';
import { string, any, number, func, bool } from 'prop-types';
import { } from 'views/components';

class ListItem extends Component {

    static defaultProps = {
        className: '',
        isSelected: false
    }

    static propTypes = {
        className: string,
        style: string,
        itemHeight: number,
        itemWidth: number,
        itemGap: number,
        layout: any,
        onClick: func,
        isSelected: bool,
        selectedColor: string,
    }

    state = {
    }

    handleClick = () => {
        this.props.onClick(this.props);
    }

    render() {
        const { className, style, itemHeight, itemWidth, itemGap, onClick, isSelected, selectedColor } = this.props;

        const componentStyle = {
            ...style,
            height: `${itemHeight}px`,
            width: `${itemWidth}px`,
            margin: `${itemGap}px`,
            backgroundColor: isSelected ? selectedColor : '',
        };

        if(this.props.layout == null) return null;
        
        return (
            <div className={`list-item clickable ${className} `} style={componentStyle} onClick={onClick ? this.handleClick : null}>
                <div style={{ backgroundColor: '#ddd', borderRadius: '5px' }} >
                    { this.props.layout || null }
                </div>
            </div>
        );
    }
}

export default ListItem;
