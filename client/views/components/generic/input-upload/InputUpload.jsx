import './InputUpload.scss';
import React, { Component } from 'react';
import { string, bool, array, object, int, any, func } from 'prop-types';
import { Label, SubmitStatusIcon } from 'views/components';
import { Grid } from '@genny-project/layson';

class InputUpload extends Component {

  static defaultProps = {
    className: '',
    validationList: [],
    mask: '',
    name: '',
    placeholder: '',
    defaultValue: '',
    readOnly: false,
    optional: false,
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    validationList: array,
    mask: string,
    name: string,
    placeholder: string,
    defaultValue: string,
    readOnly: bool,
    optional: bool,
    validation: func,
    identifier: any,
    validationStatus: string
  }

  state = {
    date: new Date(),
    hasChanges: false,
    value: this.props.value || '',
    focused: false,
  }

  handleChange = event => {
    console.log(event.target.value);
    this.setState({
      value: event.target.value
    })

    //todo loris???
  }

  render() {

    const { className, style, name, optional, readOnly, placeholder, validationStatus, isHorizontal, inputType, } = this.props;
    const componentStyle = { ...style, };
    const { date, focused, value } = this.state;

    return <div className={`input input-file-upload ${className} ${validationStatus || ''}`}>
      {!isHorizontal ? <div className="input-header">
          {name ? <Label text={name} /> : null}
          {optional ? <Label text="(optional)" /> : null}
          <SubmitStatusIcon status={validationStatus} />
        </div> : null}
      <Grid rows={1} cols={[{ style: { flexGrow: 4, marginRight: "10px" }},1]}>
        <input position={[0,0]} className="file-name-display" type='text' readOnly placeholder={placeholder || 'No file chosen'} value={value} />
        <div position={[0,1]} className="fileUpload">
          <span>+ Upload</span>
          <input className="upload" id='fileUpload' type='file' onChange={this.handleChange} />
        </div>
      </Grid>
    </div>;
  }
}

export default InputUpload;