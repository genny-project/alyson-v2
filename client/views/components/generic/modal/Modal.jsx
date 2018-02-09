import './modal.scss';
import React, { Component } from 'react';
import { string, any, func, bool } from 'prop-types';
import { IconSmall } from 'views/components';

class Modal extends Component {

  static defaultProps = {
    className: '',
    onClose: null,
    show: false,
  }

  static propTypes = {
    className: string,
    children: any,
    onClose: func,
    show: bool,
    header: any
  }

  state = {
  }

  open = () => {
  }

  close = () => {

    console.log('close');

    this.props.onClick();
  }

  render() {

    const { className, children, show } = this.props;

    return (
      <div className={`modal-container ${className} ${show ? 'animate' : 'out' }`}>
        <div className='modal-background' onClick={this.close} />
        <div className="modal">
          <IconSmall className='modal-close clickable' onClick={this.close} name='clear' />
          {children}
        </div>
      </div>
    );
  }
}

export default Modal;
