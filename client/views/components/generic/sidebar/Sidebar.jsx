import './sidebar.scss';
import React, { Component } from 'react';
import { GennyImageView, SocialButton } from '../../../components'
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

        let buttonLayout = [];
        socialLogins.forEach(social => {
            buttonLayout.push(<SocialButton buttonType={social} />);
        });

        return buttonLayout;
    }

    render() {

        const { style, src, caption, children, socialLogins } = this.props;

        const componentStyle = {
          ...style,
        };

        let imageView = null;
        if ( src ) {
            imageView = <GennyImageView src={src} caption={caption} />;
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
