import './ImageView.scss';
import React, { Component } from 'react';
import { string, any, bool, func, object } from 'prop-types';

class ImageView extends Component {

  static propTypes = {
    caption: any,
    src: string,
    placeholder: string,
    rounded: bool,
    onClick: func,
    style: object,
    className: string,
    imageStyle: object,
  };

  state = {
      error: false,
  }

  onError = () => {
      this.setState({
          error: true,
      });
  }

  render() {

    const { caption, src, onClick, style, placeholder, rounded, className, imageStyle } = this.props;
    const { error } = this.state;

    const componentStyle = {
      ...style,
    };

    return (
      <div className={`imageView ${rounded ? 'rounded' : ''} ${className}`} style={componentStyle}>
        <img style={imageStyle} src={ error === true ? 'https://i.imgur.com/FKJV3fp.jpg' : (src || placeholder)} onError={this.onError} onClick={onClick} />
        { caption ? <span style={{ "alignSelf": "center" }}>{caption}</span> : null }
      </div>
    );
  }
}

export default ImageView;
