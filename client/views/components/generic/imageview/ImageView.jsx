import './ImageView.scss';
import React, { Component } from 'react';
import { string, any } from 'prop-types';

class ImageView extends Component {

  static propTypes = {
    caption: any,
    src: string,
  };

  render() {

    const { caption, src, onClick, style } = this.props;

    const componentStyle = {
      ...style,
    };

    return (
      <div className="imageView" style={componentStyle}>
        <img src={src} onClick={onClick} />
        { caption ? <span>{caption}</span> : null }
      </div>
    );
  }
}

export default ImageView;
