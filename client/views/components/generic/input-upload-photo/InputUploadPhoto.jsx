import './inputUploadPhoto.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from '../';

class InputUploadPhoto extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: object
  }

  state = {
  }

  render() {

    const { className, style } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input-upload-photo ${className}`}>
          <p>hey</p>
      </div>
    );
  }
}

export default InputUploadPhoto;
