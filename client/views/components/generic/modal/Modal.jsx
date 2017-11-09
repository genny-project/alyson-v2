import './modal.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { IconSmall } from '../';

class Modal extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
  }

  state = {
  }

  render() {
 	  const { className, children, style } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`modal ${className}`}>
        <div className='modal-content'>
          <IconSmall className='modal-close' onClick={this.onClick(item)} name='clear' />
          {children}
        </div>
      </div>
    );
  }
}

export default Modal;
