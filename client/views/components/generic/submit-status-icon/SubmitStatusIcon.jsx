import './submitStatusIcon.scss';
import React, { Component } from 'react';
import { IconSmall } from 'views/components';
import { string, object } from 'prop-types';

class SubmitStatusIcon extends Component {
  static defaultProps = {
    className: '',
    status: ''
  }

  static propTypes = {
    className: string,
		status: string,
		style: object
  }

  render() {
		const { status, style } = this.props;
		const componentStyle = { ...style, };

		switch(status) {
			case 'sending':
			return ( 
				<div className="ellipsis-anim" style={componentStyle}>
					<IconSmall name="brightness_1" size={4} />
					<IconSmall name="brightness_1" size={4} />
					<IconSmall name="brightness_1" size={4} />
				</div>
			);
			case 'success':
			return ( 
				<IconSmall className="success" name="check_circle" size={14} style={componentStyle}/>
			);
			case 'error':
			return (
				<IconSmall className="error" name="error" size={14} style={componentStyle}/>
			);
			default:
				return null;
    }
  }
}

export default SubmitStatusIcon;
