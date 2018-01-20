import './InputUpload.scss';
import { string, bool, number, func, object, array, any } from 'prop-types';
import React, { Component } from 'react';
import Uppy from 'uppy/lib/core';
import AwsS3 from 'uppy/lib/plugins/AwsS3';
import Webcam from 'uppy/lib/plugins/Webcam';
import Dashboard from 'uppy/lib/plugins/Dashboard';
import prettierBytes from 'prettier-bytes';
import classNames from 'classnames';

class InputUpload extends Component {
  static defaultProps = {
    className: '',
    maxNumberOfFiles: 0,
    autoProceed: true,
    icon: 'add',
    defaultValue: [],
  }

  static propTypes = {
    className: string,
    maxNumberOfFiles: number,
    icon: string,
    autoProceed: bool,
    onChange: func,
    defaultValue: object,
    value: array,
    label: string,
    validation: func,
    validationList: array,
    identifier: any,
  }

  state = {
    files: this.props.value || this.props.defaultValue,
    error: null,
  }

  componentWillMount() {
    const { autoProceed } = this.props;

    this.uppy = new Uppy({
      autoProceed,
      debug: process.env.PLEASED_ENVIRONMENT === 'development',
      restrictions: {
        maxNumberOfFiles: this.props.maxNumberOfFiles,
      },
    })
      .use( Dashboard, {
        closeModalOnClickOutside: true,
      })
      .use( AwsS3, { host: 'http://localhost:3020' })
      .use( Webcam, { target: Dashboard })
      .run();

    this.uppy.on( 'complete', this.handleComplete );
  }

  componentWillUnmount() {
    this.uppy.close();

    removeEventListener( 'hashchange', this.handleHashChange, false );
  }

  get modalName() {
    return 'uppy';
  }

  getIconByFileType = fileType => {
    if ( fileType.includes( 'image' ))
      return 'image';

    if ( fileType.includes( 'video' ))
      return 'videocam';

    if ( fileType.includes( 'audio' ))
      return 'audiotrack';

    if ( fileType.includes( 'pdf' ))
      return 'picture_as_pdf';

    return 'insert_drive_file';
  }

  handleComplete = result => {
    this.setState( state => ({
      files: [
        ...state.files,
        ...result.successful.map( file => ({
          ...file,
          uploaded: true,
          id: file.meta.key,
        })),
      ],
    }), this.handleSaveToServer );
  }

  handleSaveToServer = () => {
    const { files } = this.state;

    this.setState({ error: null });

    console.log('Upload', files);

    const restructuredFiles = files.map( file => ({
      id: file.id,
      key: file.meta.key,
      name: file.name,
      type: file.type,
    }));

    const { validationList, validation, identifier } = this.props;

    if(validation) validation(JSON.stringify( restructuredFiles ), identifier, validationList);
  }

  handleSuccess = success => {
    const uploadedFiles = success.response.map(({ id }) => id );

    /* Update all the  */
    this.setState( state => ({
      files: [
        ...state.files.filter(({ id }) => !uploadedFiles.includes( id )),
        success.response,
      ],
    }), () => {
      if ( this.props.onChange ) {
        this.props.onChange({ target: { value: this.state.files } });
      }
    });
  }

  handleError = error => {
    this.setState({ error });
  }

  handleOpenModal = () => {
    this.uppy.getPlugin( 'Dashboard' ).openModal();

    /* Append some text in the location hash so that when the user
     * navigates backwards in browser history, the modal closes. */
    if ( !window.location.hash.includes( this.modalName )) {
      if ( window.location.hash ) {
        window.location.hash += `,${this.modalName}`;
      } else {
        window.location.hash = this.modalName;
      }
    }

    /* Listen for if the user presses the back button. */
    addEventListener( 'hashchange', this.handleHashChange, false );
  }

  handleHashChange = () => {
    /* If the location hash no longer contains our text, the user has
     * pressed back in their browser and we should close the modal. */
    if ( !window.location.hash.includes( this.modalName )) {
      this.uppy.getPlugin( 'Dashboard' ).closeModal();

      /* Clean up the event listener. */
      removeEventListener( 'hashchange', this.handleHashChange, false );
    }
  }

  handleRemoveFile = fileId => () => {
    this.setState( state => ({ files: state.files.filter(({ id }) => id !== fileId ) }), () => {
      this.handleRefreshUppy();
      this.handleSaveToServer();
    });
  }

  handleRefreshUppy = () => {
    this.uppy.setState({
      files: this.state.files,
    });
  }

  render() {
    const { className, icon, label } = this.props;
    const { files, error } = this.state;
    const convertedFiles = JSON.parse( files );

    return (
      <div className={classNames( 'input', 'input-file', className, {})}>
        {label && <label>{label}</label>}
        {convertedFiles && convertedFiles.length > 0 && (

          
          convertedFiles.map( file => {
            return (
              <article key={file.id}>
                <button type="button" onClick={this.handleRemoveFile( file.id )}>
                  <i className="material-icons">close</i>
                </button>

                {( file.type.includes( 'image' ) && !!file.preview ) ? (
                  <img src={file.preview} role="presentation" />
                ) : (
                  <aside>
                    <i className="material-icons">{this.getIconByFileType( file.type )}</i>
                  </aside>
                )}

                <div>
                  <a
                    href={file.uploadURL}
                    target="_blank"
                    rel="noopener"
                  >
                    {file.name} {file.uploaded ? ' (uploaded)' : ' (not uploaded)'} {error && '(ERROR)'}
                  </a>
                  <small>{prettierBytes( file.size )}</small>
                </div>
              </article>
            );
          })
        )}

        <button type="button" onClick={this.handleOpenModal}>
          <div>
            <i className="material-icons">{icon}</i>
          </div>

          <p>Upload a{files.length > 0 && 'nother'} file or image</p>
        </button>
      </div>
    );
  }
}

export default InputUpload;
