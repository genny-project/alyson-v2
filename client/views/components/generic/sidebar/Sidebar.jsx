import './sidebar.scss';
import React, { Component } from 'react';
import ImageView from '../imageview/ImageView';
import { object, bool, string, any } from 'prop-types';

class Sidebar extends Component {
    static propTypes = {
      style: object,
      hasImage: bool,
      src: string,
      caption: string,
      children: any
    };

    constructor() {
        super();
        this.state = {
            'open': true
        };
    }

    render() {
        const { style, hasImage, src, caption, children } = this.props;

        const componentStyle = {
            ...style,
        };

        let imageView;
        if ( hasImage ) {
            imageView = <ImageView src={src} caption={caption} />;
        }

        return (
            <div className="sidebar" style={componentStyle}>
              { imageView }
              {children}
            </div>
        );
    }
}

export default Sidebar;
