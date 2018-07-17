import './inputSignature.scss';
import React, { Component } from 'react';
import { func, object, string, bool } from 'prop-types';
import axios from 'axios';
import SignaturePad from 'react-signature-pad';
import { Label, SubmitStatusIcon, IconSmall } from 'views/components';

class InputSignature extends Component {
    static defaultProps = {
        labelDraw: 'Draw your signature in the box below!',
        labelType: 'Type your legal name into the field below to see your generated signature!',
        labelUpload: 'Upload a image of your signature!',
    }

    static propTypes = {
        onChange: func.isRequired,
        value: object,
        labelDraw: string,
        labelType: string,
        labelUpload: string,
        required: bool,
    };

    state = {
        selected: 'draw',
        textValue: '',
        timer: null,
    };

    componentDidMount() {
        if (this.props.value)
            this.updateSelected();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value)
            if (this.props.value)
                this.updateSelected();
    }

    updateSelected() {
        const { value } = this.props;

        if (value.type === 'text') {
            this.setState({
                selected: 'text',
                textValue: value.data,
            });
        }
        else if (value.type === 'draw') {
            this.setState({
                selected: 'draw',
            });

            this.signaturePad.fromDataURL(value.data);
        }
    }

    getOptions() {
        return [
            {
                id: 'draw',
                name: 'Draw',
                icon: 'gesture',
                instructions: this.props.labelDraw,
            },
            {
                id: 'text',
                name: 'Type',
                icon: 'text_fields',
                instructions: this.props.labelType,
            },
            {
                id: 'upload',
                name: 'Upload',
                icon: 'file_upload',
                instructions: this.props.labelUpload,
                disabled: true,
            },
        ];
    }

    handleClickOption = option => () => {
        this.setState({
            selected: option.id,
        });
    };

    handleSignatureChange = type => data => {
        this.postRequest({ type, data });
    };

    postRequest = ( data ) => {

        const url = 'https://signatures.pleased.property/signature';

        axios({
            method: 'post',
            url: url,
            data: data,
        }).then( response => {
            const uploadURL = response.data.signatureURL;
            this.setState({
                uploadedUrl: uploadURL,
            }, () => {
                if (this.props.validation) this.props.validation( uploadURL, this.props.identifier, this.props.validationList);
                if (this.props.onChange) {
                    this.props.onChange( uploadURL );
                }
            });
        });
    }

    handleClear = () => {

        if ( this.signaturePad ) {
            this.signaturePad.clear();
        } else {
            this.setState({
                textValue: '',
            });
        }
    }

    handleRemove = () => {
        if (this.props.validation) this.props.validation( '', this.props.identifier, this.props.validationList);
        if (this.props.onChange) {
            this.props.onChange( '' );
        }
    }

    onChange = event => {
        const newValue = event.target.value;
        if (newValue) {
            this.setState({
                textValue: newValue,
            }, () => {
                clearTimeout(this.state.timer);
                this.state.timer = setTimeout(function(){  
                    this.handleSignatureChange('text')(newValue);
                }.bind(this), 500);
            });
        }
    }

    onDrawChange = () => {
        this.handleSignatureChange('draw')(this.signaturePad.toDataURL());
    }

    render() {
        const { required, className, style, icon, name, mandatory, validationStatus, isHorizontal, hideHeader, inputComponent, value} = this.props;
        const componentStyle = {...style, };
        const { selected, textValue } = this.state;
        const options = this.getOptions().filter(option => !option.disabled);
        const selectedOption = options.find(option => option.id === selected);

        return (
            <div className={`input input-signature ${className}`} style={componentStyle}>
                {
                    !isHorizontal && 
                    !hideHeader
                        ? <div className="input-header">
                            { name
                                ? < Label
                                    text = { name }
                                />
                                : null }
                            { mandatory
                                ? < Label
                                    className = 'input-label-required'
                                    textStyle = {!validationStatus || validationStatus == 'error' ? { color: '#cc0000' } : null }
                                    text = "*  required"
                                /> 
                                : null }
                            <SubmitStatusIcon
                                status = { validationStatus }
                                style = {
                                    { marginLeft: '5px' }
                                }
                            />
                        </div>
                        : null
                }
                <div className="signature-entry">
                    <div className="signature-type-selector">
                        {options.map(option => (
                            <div className={`signature-type-option ${selected === option.id ? 'selected' : ''}`} key={option.id} onClick={this.handleClickOption(option)}>
                                <IconSmall name={option.icon}/>
                                <span>{option.name}</span>
                            </div>
                        ))}
                    </div>

                    <span className="signature-entry-instructions">{selectedOption.instructions}</span>
                
                    {(selected === 'draw') ? (
                        <div className="signature-draw">
                            <IconSmall className="clickable" name="delete" onClick={this.handleClear}/>
                            <SignaturePad
                                ref={ref => this.signaturePad = ref}
                                onEnd={this.onDrawChange}
                            />
                        </div>
                    ) : (selected === 'text') ? (
                        <div className="signature-type">
                            <IconSmall className="clickable" name="delete" onClick={this.handleClear}/>
                            <input type="text" placeholder="e.g. John Smith" value={textValue} onChange={this.onChange} />

                            <div className="signature-generated">
                                <small>Generated Signature</small>
                                <span>{textValue}</span>
                            </div>
                        </div>
                    ) : (
                                <div>Signature method not found</div>
                            )}
                </div>
                { 
                    this.state.uploadedUrl &&
                    <div className='signature-preview' >
                        
                        <a
                            className="file-tile"
                            href={ value }
                            target="_blank"
                            rel="noopener"
                        >
                            <img
                                className="file-image"
                                src={ value }
                            />

                            <div className="file-details">
                                <span className="file-name" >signature</span>
                            </div>
                            <IconSmall className="clickable" name="close" onClick={this.handleRemove}/>
                        </a>
                    </div>
                }
            </div>
        );
    }
}

export default InputSignature;
