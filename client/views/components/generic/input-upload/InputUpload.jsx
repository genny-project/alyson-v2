import './InputUpload.scss';
import React, { Component } from 'react';
import { string, bool, array, object, int, any, func } from 'prop-types';
import { Label, SubmitStatusIcon, InputText, Button } from 'views/components';
import { Grid } from '@genny-project/layson';

class InputUpload extends Component {

  render() {
    return <Grid cols={[5, 1]} rows={1}>
        <InputText {...this.props} readOnly position={[0, 0]}/>
        <Button position={[0, 1]} style={{ "marginTop": "21px", "marginLeft": "20px" }}>Upload</Button>
    </Grid>;
  }
}

export default InputUpload;
