import './submitStatusIcon.scss';
import React from 'react';
import { GennyComponent } from '../genny-component';
import { string } from 'prop-types';

class SubmitStatusIcon extends GennyComponent {
  static defaultProps = {
    className: '',
    status: ''
  }

  static propTypes = {
    className: string,
    status: string,
  }

  render() {
    const { status } = this.props;
	switch(status) {
	    case "sending":
	        return ( <span className="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span> );
	    case "success":
	        return ( <i className="material-icons">check_circle</i> );
	    case "error":
	        return ( <i className="material-icons">cancel</i> );
	    case "warning":
	        return ( <i className="material-icons">error</i> );
	    default:
	        return null;
    }
  }
}

export default SubmitStatusIcon;
