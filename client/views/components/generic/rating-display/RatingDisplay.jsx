import './ratingDisplay.scss';
import React, { Component } from 'react';
import { string, number, object } from 'prop-types';
import { IconSmall } from 'views/components';

class RatingDisplay extends Component {

  static defaultProps = {
    children: '',
    label: null,

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
      if (value >= i ) {
        icons.push( <IconSmall name={iconFull} size={size} style={{padding: `${size / 7 }px 0`}} /> );
      }
      else if (value < i ){
        if (value >= (i - 0.5) ) {
          icons.push( <IconSmall name={iconHalf} size={size} /> );
        }
        else {
          icons.push( <IconSmall name={iconNone} size={size} /> );
        }
      }
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
