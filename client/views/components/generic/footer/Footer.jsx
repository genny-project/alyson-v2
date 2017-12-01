import './footer.scss';
import React, { Component }  from 'react';
import { string, any, object } from 'prop-types';
import { ImageView, CompactList } from '../';

class Footer extends Component {
  static defaultProps = {
    className: '',
    
  }

  static propTypes = {
    className: string,
    style: object,
  }

  render() {
    const { className, version, poweredBy, style, } = this.props;

    const componentStyle = {
      ...style,
    };

    return (
      	<div className="footer" style={componentStyle}>
          {/* <CompactList/> */}
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
