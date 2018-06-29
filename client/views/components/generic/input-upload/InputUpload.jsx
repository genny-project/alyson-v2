import './InputUpload.scss';
import { string, bool, number, func, object, array, any, node } from 'prop-types';
import React, { Component } from 'react';
import Uppy from 'uppy/lib/core';
import AwsS3 from 'uppy/lib/plugins/AwsS3';
import Webcam from 'uppy/lib/plugins/Webcam';
import Dashboard from 'uppy/lib/plugins/Dashboard';
import StatusBar from 'uppy/lib/plugins/StatusBar';
import prettierBytes from 'prettier-bytes';
import classNames from 'classnames';
import { Label, SubmitStatusIcon, IconSmall } from 'views/components';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';

class InputUpload extends Component {

    static defaultProps = {
        className: '',
        maxNumberOfFiles: 0,
        autoProceed: true,
        icon: 'add_circle',
        defaultValue: [],
        name: '',
        mandatory: false,
        identifier: null,
        validationStatus: null,
        // allowedFileTypes: ['image/jpeg', 'image/png'],
        allowedFileTypes: null,
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
        style: object,
        mandatory: bool,
        isHorizontal: bool,
        hideHeader: bool,
        validationStatus: string,
        name: string,
        allowedFileTypes: array,
        inputComponent: node
    }

    state = {
        error: null,
        files: [],
        completeText: 'Done'
    }

    componentDidMount() {

        let files = [];
        try {
            files = (this.props.value && this.props.value != 'null') ? JSON.parse(this.props.value) : this.props.defaultValue;
        } catch (e) {}

        this.setState({
            files,
        }, () => {
            //console.log( this.state );
        });
    }

    componentDidReceiveProps(nextProps) {
        let files = [];
        try {
            files = (nextProps.value && nextProps.value != 'null') ? JSON.parse(nextProps.value) : nextProps.defaultValue;
        } catch (e) {}

        this.setState({
            files,
        }, () => {
            //console.log( this.state );
        });
    }

    componentWillMount() {

        const { autoProceed } = this.props;

        const hosturlattr = BaseEntityQuery.getBaseEntityAttribute(GennyBridge.getProject(), 'PRI_UPPY_URL');
        if (hosturlattr != null && hosturlattr.value != null) {

            this.uppy = new Uppy({
                    autoProceed,
                    debug: false,
                    restrictions: {
                        maxNumberOfFiles: this.props.maxNumberOfFiles,
                    },
                    onBeforeFileAdded: (currentFile) => this.checkFileType(currentFile)
                })
                .use(Dashboard, {
                    closeModalOnClickOutside: true,
                    // note: '.jpeg, .jpg, and .png file types allowed only',
                    hideProgressAfterFinish: true,
                })
                .use(AwsS3, { host: hosturlattr.value })
                .use(Webcam, { target: Dashboard })
                .run();

            this.uppy.on('complete', this.handleComplete);
        }
    }

    componentWillUnmount() {
        if (this.uppy) {
            this.uppy.close();
        }
        removeEventListener('hashchange', this.handleHashChange, false);
    }

    get modalName() {
        return 'uppy';
    }

    checkFileType = (currentFile) => {
        if (this.props.allowedFileTypes && !this.props.allowedFileTypes.includes(currentFile.type)) {
            this.uppy.info('Invalid file type', 'error', 3000);
            return false;
        }
        else {
            this.uppy.info('Upload successful', 'success', 3000);
            return true;
        }
    }


    getIconByFileType = fileType => {
        if (fileType.includes('image'))
            return 'image';

        if (fileType.includes('video'))
            return 'videocam';

        if (fileType.includes('audio'))
            return 'audiotrack';

        if (fileType.includes('pdf'))
            return 'picture_as_pdf';

        return 'insert_drive_file';
    }

    handleComplete = result => {
        //console.log( this.state, result );

        this.setState(state => ({
            files: [
                ...state.files,
                ...result.successful.map(file => ({
                    ...file,
                    uploaded: true,
                    id: file.meta.key,
                })),
            ],
        }), this.handleSaveToServer);
    }

    handleSaveToServer = () => {

        const { files } = this.state;
        this.setState({ error: null });

        //console.log('Upload', files);

        setTimeout(() => {
            //console.log('closing');
            this.close();
        }, 2000);
        console.log('change');
        const restructuredFiles = files;
        const { validationList, validation, identifier } = this.props;
        if (validation) validation(JSON.stringify(restructuredFiles), identifier, validationList);
        if (this.props.onChange) {
            this.props.onChange( JSON.stringify(restructuredFiles) );
        }
    }

    handleSuccess = success => {
        const uploadedFiles = success.response.map(({ id }) => id);
        //console.log('success');
        /* Update all the  */
        this.setState(state => ({
            files: [
                ...state.files.filter(({ id }) => !uploadedFiles.includes(id)),
                success.response,
            ],
        }), () => {
            if (this.props.onChange) {
                this.props.onChange({ target: { value: this.state.files } });
            }
        });
    }

    handleError = error => {
        this.setState({ error });
    }

    handleOpenModal = () => {
        this.uppy.getPlugin('Dashboard').openModal();

        /* Append some text in the location hash so that when the user
         * navigates backwards in browser history, the modal closes. */
        if (!window.location.hash.includes(this.modalName)) {
            if (window.location.hash) {
                window.location.hash += `,${this.modalName}`;
            } else {
                window.location.hash = this.modalName;
            }
        }

        /* Listen for if the user presses the back button. */
        addEventListener('hashchange', this.handleHashChange, false);
    }

    handleHashChange = () => {
        /* If the location hash no longer contains our text, the user has
         * pressed back in their browser and we should close the modal. */
        if (!window.location.hash.includes(this.modalName)) {
            this.uppy.getPlugin('Dashboard').closeModal();

            /* Clean up the event listener. */
            removeEventListener('hashchange', this.handleHashChange, false);
        }
    }

    handleRemoveFile = fileId => () => {
        this.setState(state => ({ files: state.files.filter(({ id }) => id !== fileId) }), () => {
            this.handleRefreshUppy();
            this.handleSaveToServer();
        });
    }

    handleRefreshUppy = () => {
        this.uppy.setState({
            files: this.state.files,
        });
    }

    isValidFile = file => {
        if (!file.type) {
            return false;
        }

        if (!file.id) {
            return false;
        }

        if (!file.uploadURL) {
            return false;
        }

        if (!file.name) {
            return false;
        }

        if (!file.uploaded) {
            return false;
        }

        if (!file.size) {
            return false;
        }

        return true;
    }

    close = () => {
        this.uppy.getPlugin('Dashboard').closeModal();
        //console.log('closed');
    }

    render() {
        const { className, style, icon, name, mandatory, validationStatus, isHorizontal, hideHeader, inputComponent} = this.props;
        const componentStyle = {...style, };
        const { files, error } = this.state;
        const validFiles = files && files.length ? files.filter(file => this.isValidFile(file)) : [];

        return (
            <div className = { classNames('input', 'input-file', className, {}) } > {!isHorizontal && !hideHeader ?
                <div className = "input-header" > {
                    name ? < Label text = { name }
                    /> : null} { mandatory ? < Label className = 'input-label-required'
                    textStyle = {!validationStatus || validationStatus == 'error' ? { color: '#cc0000' } : null }
                    text = "*  required" /> : null
                } <SubmitStatusIcon status = { validationStatus }
                style = {
                    { marginLeft: '5px' }
                }
                /> </div> : null
                } {
                    validFiles && validFiles.length > 0 && (
                        validFiles.map(file => {
                            return (
                                <article key = { file.id } >
                                    <button type = "button"
                                        onClick = { this.handleRemoveFile(file.id) } >
                                    <i className = "material-icons" > close </i> </button >

                                    {
                                        (file.type.includes('image') && (!!file.preview || !!file.uploadURL)) ? ( <
                                            img src = { file.uploadURL || file.preview }
                                            role = "presentation" />
                                        ) : ( <aside>
                                            <i className = "material-icons" > { this.getIconByFileType(file.type) } </i>
                                        </aside>
                                        )
                                    }

                                    <div>
                                        <a href = { file.uploadURL }
                                            target = "_blank"
                                            rel = "noopener" > { file.name } { file.uploaded ? ' (uploaded)' : ' (not uploaded)' } { error && '(ERROR)' } </a>
                                        <small> { prettierBytes(file.size) } </small>
                                    </div>
                                </article>
                            );
                        })
                    )
                }

                {
                    inputComponent &&
                    inputComponent.$$typeof
                        ? React.cloneElement(inputComponent, {
                            onClick: this.handleOpenModal    
                        })
                        : <div 
                            className = 'input-field'
                            type = "button"
                            onClick = { this.handleOpenModal }
                        >
                            <IconSmall className = 'input-file-icon'
                                name = { icon }
                            />
                            <span> Upload a{ validFiles.length > 0 && 'nother' } file or image </span>
                        </div >
                 }
            </div>
        );
    }
}

export default InputUpload;
