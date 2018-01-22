import './inputPayment.scss';
import React, { Component } from 'react';
import PaymentType from './payment-type';

class InputPayment extends Component {
  state = {
    selectedPaymentType: null,
  };

  onSelectPaymentType = type => () => {
    this.setState({
      selectedPaymentType: type,
    });
  }

  isPaymentTypeSelected() {
    return this.state.selectedPaymentType != null;
  }

  render() {
    const { selectedPaymentType } = this.state;

    return (
      <div className='input-payment'>
        <h2>Select payment type</h2>
        <p>Please select a payment type from below</p>
        <div className='payment-type-select'>
          <PaymentType type='BANK ACCOUNT' selected={selectedPaymentType === 'BANK ACCOUNT'} icon='account_balance' onClick={this.onSelectPaymentType( 'BANK ACCOUNT' )} />
          <PaymentType type='CARD' selected={selectedPaymentType === 'CARD'} icon='credit_card' onClick={this.onSelectPaymentType( 'CARD' )} />
        </div>
        <div className={`next-step-btn ${!this.isPaymentTypeSelected() ? 'disabled' : ''}`}>
          <span>NEXT</span>
          <i className='material-icons'>chevron_right</i>
        </div>
      </div>
    );
  }
}

export default InputPayment;
