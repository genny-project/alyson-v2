import './paymentMethod.scss';
import React, { Component } from 'react';
import { object, bool, func } from 'prop-types';

class PaymentMethod extends Component {
  static propTypes = {
    account: object.isRequired,
    selected: bool.isRequired,
    onClick: func.isRequired,
  };

  handleOnClick = () => {
    this.props.onClick();
  }

  render() {
    const { account, selected } = this.props;
    const selectedClass = selected ? 'selected' : '';

    return (
      <div className={`payment-method ${selectedClass}`} onClick={this.handleOnClick}>
        <div>
          {account.name}
          {account.type === 'BANK_ACCOUNT' && (
            <div>
              <small><b>BSB: </b>{account.bsb}<br /><b> Account Number: </b>{account.accountNumber}</small>
            </div>
          )}
        </div>
        {selected && (
          <div className='selected-tick'>
            <i className='material-icons'>check_circle</i>
          </div>
        )}
      </div>
    );
  }
}

export default PaymentMethod;
