import './sidebar.scss';
import React, { Component } from 'react';
import { GennyImageView, GennySocialButton } from '../../../components'
import { object, bool, string, any } from 'prop-types';

class Sidebar extends Component {

    static propTypes = {
      style: object,
      hasImage: bool,
      src: string,
      caption: any,
      children: any
    };

    renderSocialButtons = (socialLogins) => {
        return socialLogins.map(social => <GennySocialButton buttonType={social} />)
    }

    render() {

        const { style, src, caption, children, socialLogins } = this.props;

        const componentStyle = {
          ...style,
        };

        let imageView = null;
        if ( src ) {
            imageView = <GennyImageView src={src} caption={caption} style={{ maxWidth: "200px" }} />;
        }

        let loginButtons = socialLogins ? this.renderSocialButtons(socialLogins) : null;

        return (
            <div className="sidebar" style={componentStyle}>
              {imageView}
              {children}
              {loginButtons}
            </div>
        );
    }
}

export default Sidebar;
