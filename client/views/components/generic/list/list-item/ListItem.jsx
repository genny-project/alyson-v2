import './listItem.scss';
import React, { Component } from 'react';
import { string, any, number, func } from 'prop-types';
import { } from 'views/components';

class ListItem extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    itemHeight: number,
    itemWidth: number,
    itemGap: number,
    layout: any,
    onClick: func,
  }

  state = {
  }

  handleClick = () => {
    this.props.onClick(this.props);
  }

  render() {
    const { className, style, itemHeight, itemWidth, itemGap, onClick } = this.props;

    const componentStyle = {
      ...style,
      height: `${itemHeight}px`,
      width: `${itemWidth}px`,
      margin: `${itemGap}px`,
    };
 
    return (
      <div className={`list-item ${className}`} style={componentStyle} onClick={onClick ? this.handleClick : null}>
        { this.props.layout || null }
      </div>
    );
  }
}

export default ListItem;
