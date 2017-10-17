import React, { Component } from 'react';
import { string } from 'prop-types';
import { Label, InputText } from '../';

class DisplayValue extends Component {

  constructor(props) {
    super(props);
    console.log('Hey from display value component');
  }


  static defaultProps = {
    label: 'abc',
    value: 'def'
  }

  static propTypes = {
    label: string,
    value: string
  }

  render() {
    return (<div>
      < Label text={this.props.text} />  < InputText palceholder={this.props.placeholder} />
    </div >
    );
  }
}


export default DisplayValue; 
