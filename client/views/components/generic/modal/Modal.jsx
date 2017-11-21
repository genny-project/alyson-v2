import './modal.scss';
import React, { Component } from 'react';
import { string, object, any, func, bool } from 'prop-types';
import { IconSmall } from '../';

class Modal extends Component {

  static defaultProps = {
    className: '',
    onClose: null,
    show: false,
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    onClose: func,
    show: bool,
  }

  state = {
  }

  componentWillUpdate(newProps) {

      const { show } = newProps;

      if(show) {
          this.open();
      }
      else {
         this.close();
      }
  }

  open = () => {
      document.body.classList.add('modal-active');
      document.body.classList.remove('modal-closing');
  }

  close = () => {

     if(document.body.classList.contains("modal-active")) {

         if(this.props.onClose) {
             this.props.onClose();
         }

         document.body.classList.remove('modal-active');
         document.body.classList.add('modal-closing');
     }
  }

  render() {

    const { className, children, style, show } = this.props;

    return (
      <div className={`modal-container ${className} ${show ? 'animate' : 'out' }`}>
        <div className='modal-background'>
          <div className="modal">
            <IconSmall className='modal-close' onClick={this.close} name='clear' />
            {children}
            <svg class="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
				<rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
