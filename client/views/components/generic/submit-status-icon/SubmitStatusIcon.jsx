import './submitStatusIcon.scss';
import React from 'react';
import { GennyComponent } from '../genny-component';
import { IconSmall } from '../';
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
	        return ( <div className="ellipsis-anim">
	        			<IconSmall name="brightness_1" size={4} />
	        			<IconSmall name="brightness_1" size={4} />
	        			<IconSmall name="brightness_1" size={4} />
	        		</div> );
	    case "success":
	        return ( <IconSmall className="success" name="check_circle" size={14} /> );
	    case "error":
	        return ( <IconSmall className="error" name="error" size={14} /> );
	    default:
	        return null;
    }
  }
}

export default SubmitStatusIcon;
