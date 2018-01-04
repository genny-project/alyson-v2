import './ImageView.scss';
import React, { Component } from 'react';
import { string, any, bool} from 'prop-types';

class ImageView extends Component {

  static propTypes = {
    caption: any,
    src: string,
    placeholder: string,
    rounded: bool,
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

    const { caption, src, onClick, style, placeholder, rounded } = this.props;
    const { error } = this.state;

    const componentStyle = {
      ...style,
    };

    return (
      <div className={`imageView ${rounded ? 'rounded' : ''}`} style={componentStyle}>
        <img src={ error === false ? 'https://i.imgur.com/FKJV3fp.jpg' : (src || placeholder)} onError={this.onError} onClick={onClick} />
        { caption ? <span>{caption}</span> : null }
      </div>
    );
  }
}

export default ImageView;
