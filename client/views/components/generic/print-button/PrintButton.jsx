import './printButton.scss';
import React, { Component } from 'react';
import { Button } from 'views/components';

class PrintButton extends Component {

  static defaultProps = {
   
  }

  static propTypes = {
    
  }

  onClick = () => {
    window.print();
  }

  render() {

    return (
      <Button 
        className={'form-button form-print'}
        onClick={this.onClick}
      />
    );
  }
}

export default PrintButton;
