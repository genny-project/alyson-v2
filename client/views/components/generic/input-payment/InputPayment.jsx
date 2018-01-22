import './inputPayment.scss';
import React, { Component } from 'react';
import PaymentType from './payment-type';

class InputPayment extends Component {
  state = {
    selectedPaymentType: null,
    stage: 0,
  };

  static defaultProps = {
    accounts: [
      {
        id: 1,
        type: 'BANK_ACCOUNT',
        name: 'NAB Business',
        bsb: '833023',
        accountNumber: '126456432'
      }
    ]
  };

  onSelectPaymentType = type => () => {
    this.setState({
      selectedPaymentType: type,
    });
  }

  isPaymentTypeSelected() {
    return this.state.selectedPaymentType != null;
  }

  onGoNext = () => {
    this.setState({
      stage: this.state.stage + 1,
    });
  }

  renderSelectType() {
    const { selectedPaymentType } = this.state;

    return (
      <div>
        <h2>Select payment type</h2>
        <p>Please select a payment type from below</p>
        <div className='payment-type-select'>
          <PaymentType type='BANK ACCOUNT' selected={selectedPaymentType === 'BANK_ACCOUNT'} icon='account_balance' onClick={this.onSelectPaymentType( 'BANK_ACCOUNT' )} />
          <PaymentType type='CARD' selected={selectedPaymentType === 'CARD'} icon='credit_card' onClick={this.onSelectPaymentType( 'CARD' )} />
        </div>
      </div>
    );
  }

  renderSelectAccount() {
    return (
      <div>
        <h2>Select account</h2>
        <p>Please select a account from below</p>
      </div>
    );
  }

  render() {
    const { stage } = this.state;
    return (
      <div className='input-payment'>
        { stage === 0 && this.renderSelectType() }
        { stage === 1 && this.renderSelectAccount() }
        <div className={`next-step-btn ${!this.isPaymentTypeSelected() ? 'disabled' : ''}`} onClick={this.onGoNext}>
          <span>NEXT</span>
          <i className='material-icons'>chevron_right</i>
        </div>
      </div>
    );
  }
}

export default InputPayment;
