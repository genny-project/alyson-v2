import './footer.scss';
import React, { Component }  from 'react';
import { string, any } from 'prop-types';
import { ImageView } from '../';

class Footer extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
  }

  render() {
    const { className, version, poweredBy } = this.props;

    return (
      	<div className="footer">
          { version ? <span className="version">{version}</span> : null }
      		{ poweredBy ? 
            <div className="powered-by">
              <span>powered by: </span>
              { poweredBy.img ? <ImageView src={poweredBy.img} /> : null }
              { poweredBy.caption ? <span>{poweredBy.caption}</span> : null }
            </div>
          : null }
    	</div>
    );
  }
}

export default Footer;