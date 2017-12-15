import './listItem.scss';
import React, { Component } from 'react';
import { string, object, number } from 'prop-types';
import { } from '../';

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
  }

  state = {
  }

  render() {
    const { className, style, itemHeight, itemWidth, itemGap } = this.props;

    const componentStyle = {
      ...style,
      'height': `${itemHeight}px`,
      'width': `${itemWidth}px`,
      'margin': `${itemGap}px`,
    };
 
    return (
      <div className={`list-item ${className}`} style={componentStyle}>
        { this.props.layout || null }
      </div>
    );
  }
}

export default ListItem;
