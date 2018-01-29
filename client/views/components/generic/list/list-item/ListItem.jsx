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
    isSelected: bool
  }

  state = {
  }

  handleClick = () => {
    this.props.onClick(this.props);
  }

  render() {
    const { className, style, itemHeight, itemWidth, itemGap, onClick, isSelected } = this.props;

    const componentStyle = {
      ...style,
      height: `${itemHeight}px`,
      width: `${itemWidth}px`,
      margin: `${itemGap}px`,
    };

    console.log(this.props);
 
    return (
      <div className={`list-item ${className} ${isSelected ? 'selected' : ''}`} style={componentStyle} onClick={onClick ? this.handleClick : null}>
        { this.props.layout || null }
      </div>
    );
  }
}

export default ListItem;
