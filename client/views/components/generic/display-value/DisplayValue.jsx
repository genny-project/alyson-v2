import React, { Component } from 'react';
import { string } from 'prop-types';
import { Label, InputText } from '../';

class DisplayValue extends Component {

  constructor(props) {
    super(props);
    console.log('Hey from display value component');
  }


  static defaultProps = {
    label: string,
    value: string

  }

  static propTypes = {
    label: string,
    value: string

  }


  render() {
    return (
      <div>
        <Label text= {this.props.text}/>
        <InputText placeholder={this.props.placeholder}/>

      </div>
    );
  }
}


export default DisplayValue;
