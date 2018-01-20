import './footer.scss';
import React, { Component }  from 'react';
import { string, any, object } from 'prop-types';
import { ImageView } from 'views/components';

class Footer extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: object,
    poweredBy: object,
    version: string,
    children: any,
  }

  render() {
    const { version, poweredBy, style, children } = this.props;

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
          {children}
        </div>
      );
    }
  }

  export default Footer;
