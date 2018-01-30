/* globals promisepay */
import './inputPayment.scss';
import React, { Component } from 'react';
import { array, object, string } from 'prop-types';
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
    data: object,
    amount: string,
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
    const project = GennyBridge.getProject ? GennyBridge.getProject() : null;
    const bankTokenAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_ASSEMBLY_BANK_TOKEN' );
    const cardTokenAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_ASSEMBLY_CARD_TOKEN' );
    const accountsAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_PAYMENT_METHODS' );
    const amount = this.props.data ? BaseEntityQuery.getBaseEntityAttribute( this.props.data.targetCode, 'PRI_OWNER_INCGST' ) : null;
    const descriptionAttribute = BaseEntityQuery.getBaseEntityAttribute( project, 'PRI_PAYMENT_CONFIRM_TEXT' );
    const description = descriptionAttribute ? descriptionAttribute.value : 'will be charged / debited from the below account to escrow for the payment of this job.';

    this.setState({
      tokens: {
        ...this.state.tokens,
        bank: bankTokenAttribute ? bankTokenAttribute.value : null,
        card: cardTokenAttribute ? cardTokenAttribute.value : null,
      },
      amount: amount ? amount.value : ( this.props.amount ? this.props.amount :  '0.00' ),
      accounts: accountsAttribute ? JSON.parse(accountsAttribute.value) : ( this.props.accounts ? this.props.accounts : []),
      confirmDescription: description,
    });

    /* Generate a device ID and grab IP address for the user */
    promisepay.captureDeviceId( data => {
      this.setState({
        deviceID: data,
      });
    })

    promisepay.getIPAddress( data => {
      this.setState({
        ipAddress: data,
      })
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
    if ( !this.canGoNext()) {
      return;
    }

    if ( this.state.stage === 2 ) {
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

  onHandleDone = () => {
    alert( 'Done' );
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

  renderConfirmPayment() {
    const { amount, confirmDescription, selectedPaymentMethod, accounts } = this.state;
    const account = accounts.find( a => a.id === selectedPaymentMethod );
    return (
      <div>
        <h2>{this.renderBackButton()} Confirm payment</h2>
        <p>Click CONFIRM below to confirm that <b>${amount}</b> (including GST) {confirmDescription}</p>
        <PaymentMethod
          key={account.id}
          account={account}
          onClick={this.handleSelectPaymentMethod( account )}
          selected={selectedPaymentMethod === account.id}
        />
      </div>
    );
  }

  renderConfirmButton() {
    const { amount } = this.state;
    return (
      <div className='confirm-btn' onClick={this.onHandleDone}>
        <span>CONFIRM PAYMENT OF ${amount}</span>
        <i className='material-icons'>check</i>
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
        { stage === 2 && this.renderConfirmPayment() }
        { stage < 2 ? this.renderNextButton() : this.renderConfirmButton() }
      </div>
    );
  }
}

export default InputPayment;
