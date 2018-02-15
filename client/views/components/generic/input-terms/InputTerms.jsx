import './inputTerms.scss';
import React, { Component } from 'react';
import { string, any, bool, func, array, object } from 'prop-types';
import { InputCheckbox, Modal } from 'views/components';

class InputTerms extends Component {

  static defaultProps = {
    className: '',
    checked: false,
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    checked: bool,
    validation: func,
    identifier: any,
    validationStatus: string,
    handleOnChange: func,
    validationList: array,
    name: string,
    html: string,
    mandatory: bool
  }

  state = {
    modalContent: null
  }

  handleClick = () => {
    
    let modal = <div className="terms-and-conditions-content" dangerouslySetInnerHTML={{ __html: this.props.html }} />;

    this.setState({
      modalContent: modal
    });
  }

  render() {
    const { className, name, mandatory, ...rest } = this.props;
    const {modalContent, isChecked} = this.state;
    return (
      <div className={`input input-checkbox ${className}`}>
        {modalContent ? <Modal show={true} onClick={this.toggleModal} >{modalContent}</Modal> : null}
        <InputCheckbox 
          {...rest}
          checked={isChecked}
          onClick={this.handleClick} 
        />
      </div>
    );
  }
}

export default InputTerms;
