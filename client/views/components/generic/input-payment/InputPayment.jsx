import './inputPayment.scss';
import React, { Component } from 'react';
import { array } from 'prop-types';
import PaymentType from './payment-type';
import PaymentMethod from './payment-method';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';

class InputPayment extends Component {
  state = {
    selectedPaymentType: null,
    selectedPaymentMethod: null,
    stage: 0,
    tokens: {
      bank: null,
      card: null,
    },
    accounts: [],
  };

  static propTypes = {
    accounts: array,
  };

  static defaultProps = {
    accounts: [
      {
        id: 1,
        type: 'BANK_ACCOUNT',
        name: 'NAB Business',
        bsb: '833023',
        accountNumber: '126456432'
      },
      {
        id: 2,
        type: 'BANK_ACCOUNT',
        name: 'Westpac Personal',
        bsb: '133663',
        accountNumber: '832534723'
      },
      {
        id: 3,
        type: 'CARD',
        name: 'Business Credit',
        number: 'XXXX-XXXX-XXXX-1111'
      }
    ]
  };

  componentDidMount() {
    const user = GennyBridge.getUser();
    const bankTokenAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_ASSEMBLY_BANK_TOKEN' );
    const cardTokenAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_ASSEMBLY_CARD_TOKEN' );
    const accountsAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_PAYMENT_METHODS' );

    this.setState({
      tokens: {
        ...this.state.tokens,
        bank: bankTokenAttribute ? bankTokenAttribute.value : null,
        card: cardTokenAttribute ? cardTokenAttribute.value : null,
      },
      accounts: accountsAttribute ? JSON.parse(accountsAttribute.value) : ( this.props.accounts ? this.props.accounts : []),
    });
  }

  onSelectPaymentType = type => () => {
    this.setState({
      selectedPaymentType: type,
    });
  }

  isPaymentTypeSelected() {
    return this.state.selectedPaymentType != null;
  }

  isPaymentMethodSelected() {
    return this.state.selectedPaymentMethod != null;
  }

  canGoNext() {
    if ( this.state.stage === 0 && this.isPaymentTypeSelected() ) {
      return true;
    }

    if ( this.state.stage === 1 && this.isPaymentMethodSelected() ) {
      return true;
    }

    return false;
  }

  onGoNext = () => {
    if ( this.state.stage === 1 ) {
      return;
    }

    this.setState({
      stage: this.state.stage + 1,
    }, () => {
      if (this.state.stage === 1) {
        /* Reset the selected payment method */
        this.setState({
          selectedPaymentMethod: null,
        });
      }
    });
  }

  onGoBack = () => {
    if ( this.state.stage === 0 ) {
      return;
    }

    this.setState({
      stage: this.state.stage - 1,
    });
  }

  handleSelectPaymentMethod = account => () => {
    this.setState({
      selectedPaymentMethod: account.id,
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
    const { selectedPaymentType, selectedPaymentMethod } = this.state;
    const { accounts } = this.props;

    return (
      <div>
        <h2>{this.renderBackButton()} Select account {this.renderAddButton()}</h2>
        <p>Please select a account from below</p>
        <div className='payment-methods'>
          { accounts.filter( account => account.type === selectedPaymentType ).map( account => (
            <PaymentMethod
              key={account.id}
              account={account}
              onClick={this.handleSelectPaymentMethod( account )}
              selected={selectedPaymentMethod === account.id}
            />
          ))}
        </div>
      </div>
    );
  }

  renderNextButton() {
    return (
      <div className={`next-step-btn ${!this.canGoNext() ? 'disabled' : ''}`} onClick={this.onGoNext}>
        <span>NEXT</span>
        <i className='material-icons'>chevron_right</i>
      </div>
    );
  }

  renderBackButton() {
    return (
      <div className={'back-step-btn'} onClick={this.onGoBack}>
        <i className='material-icons'>chevron_left</i>
      </div>
    );
  }

  renderAddButton() {
    return (
      <div className='add-btn'>
        ADD
        <i className='material-icons'>add</i>
      </div>
    );
  }

  render() {
    const { stage } = this.state;
    return (
      <div className='input-payment'>
        { stage === 0 && this.renderSelectType() }
        { stage === 1 && this.renderSelectAccount() }
        {this.renderNextButton()}
      </div>
    );
  }
}

export default InputPayment;
