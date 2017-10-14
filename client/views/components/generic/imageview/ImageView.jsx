import './ImageView.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';

class ImageView extends Component {
  static propTypes = {
    caption: string,
    src: string,
  };

  render() {
    const { caption, src, onClick } = this.props;

    return (
      <div className="imageView">
        <img src={src} onClick={onClick} />
        {caption && <p>{caption}</p>}
      </div>
    );
  }
}

export default ImageView;
