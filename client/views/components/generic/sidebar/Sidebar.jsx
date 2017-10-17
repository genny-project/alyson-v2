import './sidebar.scss';
import React, { Component } from 'react';
import { GennyImageView } from '../../../components'
import { object, bool, string, any } from 'prop-types';

class Sidebar extends Component {

    static propTypes = {
      style: object,
      hasImage: bool,
      src: string,
      caption: any,
      children: any
    };

    render() {

        const { style, hasImage, src, caption, children } = this.props;

        const componentStyle = {
          ...style,
        };

        let imageView = null;
        if ( hasImage ) {
            imageView = <GennyImageView src={src} caption={caption} />;
        }

        return (
            <div className="sidebar" style={componentStyle}>
              {imageView}
              {children}
            </div>
        );
    }
}

export default Sidebar;
