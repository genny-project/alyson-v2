import './footer.scss';
import React, { Component }  from 'react';
import { string, any } from 'prop-types';

class Footer extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    children: any.isRequired,
    className: string,
  }

  render() {
    const { className, children } = this.props;

    return (
      	<div className="footer">
      		{children}
    	</div>
    );
  }
}

export default Footer;