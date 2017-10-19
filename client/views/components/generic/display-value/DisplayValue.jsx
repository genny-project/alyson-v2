import React, { Component } from 'react';
import { string } from 'prop-types';
import { Label, InputText } from '../';

class DisplayValue extends Component {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    text: 'example text',
    placeholder: ' example placeholder'
  }

  static propTypes = {
    text: string,
    placeholder: string
  }

  render() {
    return (<div>
      < Label text={this.props.text} />  < InputText placeholder={this.props.placeholder} />
    </div >
    );
  }
}

export default DisplayValue; 
