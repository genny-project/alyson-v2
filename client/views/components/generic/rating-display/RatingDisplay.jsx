import './ratingDisplay.scss';
import React, { Component } from 'react';
import { string, number, object } from 'prop-types';
import { IconSmall } from 'views/components';

class RatingDisplay extends Component {

  static defaultProps = {
    children: '',

    iconFull: 'star',
    iconHalf: 'star_half',
    iconNone: 'star_border',
    total: 5,
    value: 2,
    size: 24
  }

  static propTypes = {
    className: string,
    style: object,
    label: string,
    size: number,
    color: string,
    
    iconFull: string,
    iconHalf: string,
    iconNone: string,
    value: number,
    total: number,

  }

  renderIcons = () => {
    const {value, total, iconNone, iconHalf, iconFull, size } = this.props;
  
    let icons = [];

    for(let i = 1; i < (total + 1); i++) {
      let iconType;
      if (value >= i ) {
        iconType = iconFull;
      }
      else if (value < i ){
        if (value >= (i - 0.5) ) {
          iconType = iconHalf;
        }
        else {
          iconType = iconNone;
        }
      }
      icons.push(
        <IconSmall
          name={iconType}
          size={size}
        />
      );
    }
    return icons;
  }
 
  render() {

    const { className, style } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className={`rating-display ${className || ''}`} style={componentStyle}>
        <div className='rating-display-container' >
          {this.renderIcons()}
        </div>
      </div>
    );
  }
}

export default RatingDisplay;
