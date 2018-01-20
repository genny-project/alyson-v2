import './InputUpload.scss';
import { string, bool, number, func, object, array } from 'prop-types';
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
    showPhotoGalleryWithIndex: func,
    onChange: func,
    defaultValue: object,
    value: array,
    label: string,
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
    console.log( result );

    this.setState( state => ({
      files: [
        ...state.files,
        ...result.successful.map( file => ({
          ...file,
          uploaded: false,
          id: file.meta.key,
        })),
      ],
    }), this.handleSaveToServer );
  }

  handleSaveToServer = () => {
    const { files } = this.state;

    this.setState({ error: null });

    const restructuredFiles = files.map( file => ({
      id: file.id,
      key: file.meta.key,
      name: file.name,
      type: file.type,
    }));

    console.log( restructuredFiles );
  }

  handleSuccess = success => {
    console.log( success );

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
    console.error( error );

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
    this.setState( state => ({ files: state.files.filter(({ id }) => id !== fileId ) }), this.handleRefreshUppy );
  }

  handleRefreshUppy = () => {
    this.uppy.setState({
      files: this.state.files,
    });
  }

  handleShowImage = imageToShow => event => {
    event.preventDefault();

    const images = this.state.files.filter(({ type }) => type.includes( 'image' ));
    const index = images.findIndex( image => (( image.uploadURL === imageToShow.uploadURL ) || ( image.url === imageToShow.url )));

    this.props.showPhotoGalleryWithIndex( index, ...images );

    return false;
  }

  render() {
    const { className, icon, label } = this.props;
    const { files, error } = this.state;

    return (
      <div className={classNames( 'input', 'input-file', className, {})}>
        {label && <label>{label}</label>}

        {files.length > 0 && (
          files.map( file => {
            return (
              <article key={file.id}>
                <button type="button" onClick={this.handleRemoveFile( file.id )}>
                  <i className="material-icons">close</i>
                </button>

                {( file.type.includes( 'image' ) && !!file.preview ) ? (
                  <img src={file.preview} role="presentation" onClick={this.handleShowImage( file )} />
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
                    onClick={file.type.includes( 'image' ) && this.handleShowImage( file )}
                  >
                    {file.name} {file.uploaded ? ' (uploaded' : ' (not uploaded)'} {error && '(ERROR)'}
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
