import './dateLabel.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import moment from 'moment';

class DateLabel extends Component {

  static defaultProps = {
    children: '',
    format: 'DD/MM/YYYY'
  }

  static propTypes = {
    className: string,
    date: string,
    format: string,
  }

  renderDate = (date) => {
    const { format } = this.props;
    
    console.log(date, format);

    if (date) {
      const formattedDate = moment(date).format(format);
      return formattedDate;
    } else {
      return null;
    } 
  }

  render() {
 	  const { className, children, style } = this.props;
    const componentStyle = { ...style, };

    console.log(children);

    return (
      <div className={`date-label ${className || ''}`} style={componentStyle}>
        <span className="date-label-text">
          {this.renderDate(children)}
        </span>
      </div>
    );
  }
}

export default DateLabel;