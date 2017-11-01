import './status.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';

class Status extends Component {

  static defaultProps = {
    className: '',
    color: ''
  }

  static propTypes = {
    className: string,
    style: string,
    color: string
  }

  state = {
    statusColor: null,
    statusClass: null,
  }

  getStatusColor = (color) => {
    switch(color) {
      case "success":
        this.setState({ statusClass: color, });
        break;
      case "warning":
        this.setState({ statusClass: color, });
        break;
      case "error":
        this.setState({ statusClass: color, });
        break;
      default:
        this.setState({ statusColor: { backgroundColor: color } });
    }

  }

  render() {
 	  const { className, style, color } = this.props;
    this.getStatusColor(color);
    const componentStyle = { ...style, statusColor };

    return (
      <div className={`status ${className} ${statusClass}`} style={{componentStyle}}/>
    );
  }
}

export default Status;
