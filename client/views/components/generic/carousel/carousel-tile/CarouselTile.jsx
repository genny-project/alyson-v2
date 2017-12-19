import './carouselTile.scss';
import React, { Component } from 'react';
import { string, } from 'prop-types';
import { } from '../';

class CarouselTile extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    itemHeight: string,
    itemWidth: string,
    itemGap: string,
  }

  state = {
  }

  render() {
    const { className, style, itemHeight, itemWidth, itemGap } = this.props;

    const componentStyle = {
      ...style,
      height: itemHeight ? `${itemHeight}px` : null,
      width: itemWidth ? `${itemWidth}px` : null,
      margin: itemGap ? `${itemGap}px` : null,
    };

    console.log(componentStyle);
 
    return (
      <div className={`carousel-tile ${className}`} style={componentStyle}>
        { this.props.layout || null }
      </div>
    );
  }
}

export default CarouselTile;
