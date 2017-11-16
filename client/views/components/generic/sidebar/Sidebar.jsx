import './sidebar.scss';
import React, { Component } from 'react';
import { ImageView, } from '../../../components'
import { object, bool, string, any } from 'prop-types';

class Sidebar extends Component {

    static propTypes = {
      style: object,
      src: string,
      caption: any,
      children: any,
      height: string,
      screenSize: string,
    };

    getContentHeight = () => {
        const { height } = this.props;

        let s = Number(height.substr(0,height.length-2))+30;
        
        return {height: `calc(100vh - ${s}px)`}
    }

    render() {

        const { style, src, caption, children, height, screenSize } = this.props;

        const componentStyle = {
          ...style,
        };

        const contentHeight = this.getContentHeight();

        console.log(screenSize === 'xs' || screenSize === 'sm' ? 'small' : screenSize === 'md' ? 'medium' : 'large');

        let imageView = null;
        if ( src ) {
            imageView = <ImageView src={src} caption={caption} style={{ maxWidth: "200px" }} />;
        }

        return (
            <div className={`sidebar ${screenSize}`} style={componentStyle}>
              <div className="sidebar-header" style={{height: height}}>
                {imageView}
              </div>
              <div className="sidebar-content" style={contentHeight}>
                {children}
              </div>
            </div>
        );
    }
}

export default Sidebar;
