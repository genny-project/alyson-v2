import './dateLabel.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import moment from 'moment';

class DateLabel extends Component {

  static defaultProps = {
    text: '',
    format: 'DD/MM/YYYY'
  }

  static propTypes = {
    className: string,
    date: string,
    format: string,
  }

  renderDate = (date) => {
    const { format } = this.props;
    
    if (date) {
      const formattedDate = moment(date).format(format);
      return formattedDate;
    } else {
      return null;
    } 
  }

  render() {
 	  const { className, text, style } = this.props;
    const componentStyle = { ...style, };
    return (
      <div className={`date-label ${className || ''}`} style={componentStyle}>
        <span className="date-label-text">
          {this.renderDate(text)}
        </span>
      </div>
    );
  }
}

export default DateLabel;