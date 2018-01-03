import './dateLabel.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import moment from 'moment';

class DateLabel extends Component {

  static defaultProps = {
    text: '',
    defaultDateFormat: 'DD/MM/YYYY'
  }

  static propTypes = {
    className: string,
    date: string,
    defaultDateFormat: string,
    format: string,
  }

  renderDate = (date) => {
    const { defaultDateFormat, format } = this.props;
    
    if (date) {
      if (format) {
        const formattedDate = moment(date).format(format);
      } else {
        const formattedDate = moment(date).format(defaultDateFormat);
      }
      return formattedDate;
    } else {
      return null;
    } 
  }

  render() {
 	  const { className, text, defaultDateFormat, style } = this.props;
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