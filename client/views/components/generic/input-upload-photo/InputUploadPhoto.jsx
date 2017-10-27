import './inputUploadPhoto.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from '../';
import DropzoneComponent from 'react-dropzone-component';
import 'react-dropzone-component/styles/filepicker.css';

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

  droppedFile = (file) => {

      console.log(file);
  }

  render() {

    const { className, style } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    const componentConfig = {
        showFiletypeIcon: true,
        postUrl: 'no-url-but-this-is-mandatory-lol'
    };

    const djsConfig = { autoProcessQueue: false }
    const eventHandlers = { addedfile: this.droppedFile }

    return (
      <div className={`input-upload-photo ${className}`}>
          <DropzoneComponent config={componentConfig}
                             eventHandlers={eventHandlers}
                             djsConfig={djsConfig} />
      </div>
    );
  }
}

export default InputUploadPhoto;
