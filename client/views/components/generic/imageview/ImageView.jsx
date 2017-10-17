import './ImageView.scss';
import React, { Component } from 'react';
import { string, any } from 'prop-types';

class ImageView extends Component {

  static propTypes = {
    caption: any,
    src: string,
  };

  render() {

    const { caption, src, onClick } = this.props;

    return (
      <div className="imageView">
        <img src={src} onClick={onClick} />
        {caption}
      </div>
    );
  }
}

export default ImageView;
