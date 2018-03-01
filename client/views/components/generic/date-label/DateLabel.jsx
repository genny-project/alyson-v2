import './dateLabel.scss';
import React, { Component } from 'react';
import { string, any, object, bool } from 'prop-types';
import moment from 'moment';
import { BaseEntityQuery } from 'utils/genny';

class DateLabel extends Component {

  static defaultProps = {
    children: '',
    format: 'DD/MM/YYYY',
    fromNow: false,
  }

  static propTypes = {
    className: string,
    date: string,
    format: string,
    children: any,
    style: object,
    fromNow: bool,
  }

  renderDate = (date) => {
    const { format } = this.props;

    if (date) {
      const formattedDate = moment(date);
      if(formattedDate.isValid()) return formattedDate.format(format);
    }

    return null;
  }

  renderFromNow = (code) => {

    if (code) {
      let createdAt = BaseEntityQuery.getBaseEntity(code);
      if (createdAt && createdAt.created){
        let date = moment(createdAt.created);
        let now = moment();
        return date.from(now);
      }
      else {
        return null;
      }
    } else {
      return null;
    }
  }

  render() {

    const { className, fromNow, children, date, style } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className={`date-label ${className || ''}`} style={componentStyle}>
        <span className="date-label-text">
          {
            fromNow ?
            this.renderFromNow(children || date) :
            this.renderDate(children || date)
          }
        </span>
      </div>
    );
  }
}

export default DateLabel;
