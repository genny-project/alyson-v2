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

     if(document.body.classList.contains('modal-active')) {

         if(this.props.onClose) {
             this.props.onClose();
         }

         document.body.classList.remove('modal-active');
         document.body.classList.add('modal-closing');
     }
  }

  render() {

    const { className, children, show, header } = this.props;

    return (
      <div className={`modal-container ${className} ${show ? 'animate' : 'out' }`}>
        <div className='modal-background'>
          <div className="modal">
            <div className="modal-header">
                {header}
                <IconSmall className='modal-close' onClick={this.close} name='clear' />
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
