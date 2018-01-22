import './paymentMethod.scss';
import React, { Component } from 'react';
import { object } from 'prop-types';

class PaymentMethod extends Component {
  static propTypes = {
    account: object.isRequired,
  };

  render() {
    const { account } = this.props;
     return (
      <div className='payment-method'>
        {account.name}
        {account.type === 'BANK_ACCOUNT' && (
          <div>
            <small><b>BSB: </b>{account.bsb}<br /><b> Account Number: </b>{account.accountNumber}</small>
          </div>
        )}
      </div>
    );
  }
}

export default PaymentMethod;
