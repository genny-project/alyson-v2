/* globals promisepay */
import './inputPayment.scss';
import 'react-credit-cards/lib/styles.scss';
import React, { Component } from 'react';
import { array, object, string } from 'prop-types';
import Cards from 'react-credit-cards';
import PaymentType from './payment-type';
import PaymentMethod from './payment-method';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import MaskedInput from 'react-text-mask';
import { Spinner } from 'views/components/generic';
import Dropdown from 'react-dropdown';

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
    addingAccount: false,
    addingAccountType: '',
    form: {
      nickname: '',
      number: '',
      name: '',
      expiry: '',
      cvc: '',
      bankName: '',
      bsb: '',
      accountNumber: '',
      accountType: '',
      holderType: '',
    },
    focusedField: '',
    error: null,
    submitting: false,
  };

  static propTypes = {
    accounts: array,
    data: object,
    amount: string,
  };

  static defaultProps = {
    // accounts: [
    //   {
    //     id: 1,
    //     type: 'BANK_ACCOUNT',
    //     name: 'NAB Business',
    //     bsb: '833023',
    //     accountNumber: '126456432'
    //   },
    //   {
    //     id: 2,
    //     type: 'BANK_ACCOUNT',
    //     name: 'Westpac Personal',
    //     bsb: '133663',
    //     accountNumber: '832534723'
    //   },
    //   {
    //     id: 3,
    //     type: 'CARD',
    //     name: 'Business Credit',
    //     number: 'XXXX-XXXX-XXXX-1111'
    //   }
    // ]

    accounts: []
  };

  componentDidMount() {

    const user = GennyBridge.getUser();
    const project = GennyBridge.getProject ? GennyBridge.getProject() : null;
    const bankTokenAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_ASSEMBLY_BANK_TOKEN' );
    const cardTokenAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_ASSEMBLY_CARD_TOKEN' );
    const accountsAttribute = BaseEntityQuery.getBaseEntityAttribute( user, 'PRI_USER_PAYMENT_METHODS' );
    const amount = this.props.data ? BaseEntityQuery.getBaseEntityAttribute( this.props.data.targetCode, 'PRI_OWNER_PRICE_INC_GST' ) : null;
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

  onClickAddAccount = type => () => {
    this.setState({
      addingAccount: true,
      addingAccountType: type,
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
          error: null,
        });
      }
    });
  }

  onGoBack = () => {
    if ( this.state.addingAccount ) {
      this.setState({ addingAccount: false });
      return;
    }

    if ( this.state.stage === 0 ) {
      return;
    }

    this.setState({
      stage: this.state.stage - 1,
    });
  }

  onHandleDone = () => {

    GennyBridge.sendAnswer([{
        ...this.props.data,
        value: JSON.stringify({
            ipAddress: this.state.ipAddress,
            accountID: this.state.selectedPaymentMethod,
            deviceID: this.state.deviceID
        })
    }]);
  }

  handleInputChange = field => event => {
    this.setState({
      form: {
        ...this.state.form,
        [field]: event.target ? event.target.value : event ,
      }
    });
  }

  handleInputFocus = field => () => {
    this.setState({
      focusedField: field,
    });
  }

  handleSelectPaymentMethod = account => () => {
    this.setState({
      selectedPaymentMethod: account.id,
    });
  }

  submitAddPayment = () => {
    const { addingAccountType } = this.state;

    this.setState({
      error: null,
      submitting: true,
    });

    if ( addingAccountType === 'CARD' ) {
      this.submitCreditCard();
    }

    if ( addingAccountType === 'BANK_ACCOUNT' ) {
      this.submitBankAccount();
    }
  }

  niceAssemblyError( error ) {
    const output = [];
    Object.keys( error.errors ).forEach( key => {
      error.errors[key].forEach( e => {
        output.push( `${key.split( '_' ).join( '' )} ${e}` );
      });
    });

    const outputString = output.join( ', ' );

    return outputString.charAt( 0 ).toUpperCase() + outputString.slice( 1 );
  }

  submitNewPaymentMethod(jsonObject) {

      GennyBridge.sendBtnClick('PAYMENT_SUBMIT', {
          code: "USER_ADD_NEW_PAYMENT_METHOD",
          value: JSON.stringify(jsonObject)
      });
  }

  submitCreditCard() {

    const { tokens, form } = this.state;
    const { nickname, name, number, expiry, cvc } = form;
    promisepay.createCardAccount( tokens.card, {
      full_name: name,
      number: number.split( ' ' ).join( '' ),
      expiry_month: expiry.split( '/' )[0],
      expiry_year: `20${expiry.split( '/' )[1]}`,
      cvv: cvc,
    }, success => {

      this.submitNewPaymentMethod({
        id: success.id,
        type: 'CARD',
        name: name,
        number: number
      });

      this.setState({
          accounts: [
              ...this.state.accounts,
              {
                id: success.id,
                type: 'CARD',
                name: name,
                number: number
              }
          ]
      })

      this.setState({
        submitting: false,
        error: 'Success',
      });
    }, error => {
      this.setState({
        submitting: false,
        error: this.niceAssemblyError( error.responseJSON ),
      });
    });
  }

  submitBankAccount() {

    const { tokens, form } = this.state;

    promisepay.createBankAccount( tokens.bank, {
      bank_name: form.bankName,
      account_name: form.name,
      routing_number: form.bsb.replace("-", ""),
      account_number: form.accountNumber,
      account_type: form.accountType.value,
      holder_type: form.holderType.value,
      country: 'AUS',
      payout_currency: 'AUD',
    }, success => {

        console.log( success );

        this.submitNewPaymentMethod({
            id: success.id,
            type: 'BANK_ACCOUNT',
            name: form.accountName,
            bsb: form.bsb,
            accountNumber: form.accountNumber
        });

        this.setState({
            accounts: [
                ...this.state.accounts,
                {
                    id: success.id,
                    type: 'BANK_ACCOUNT',
                    name: form.accountName,
                    bsb: form.bsb,
                    accountNumber: form.accountNumber
                }
            ]
        })

      this.setState({
        submitting: false,
        error: 'Success',
      });
    }, error => {
      this.setState({
        submitting: false,
        error: this.niceAssemblyError( error.responseJSON ),
      });
    });
  }

  canAddPaymentMethod() {
    const { addingAccountType, form } = this.state;

    if ( addingAccountType === 'CARD' ) {
      if ( form.number === '' || form.name === '' || form.expiry === '' || form.cvc === '' || form.nickname === '' ) {
        return false;
      }

      if ( !form.number.match( /[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}/g )) {
        return false;
      }

      if ( !form.expiry.match( /[0-9]{2}\/[0-9]{2}/g )) {
        return false;
      }

      if ( !form.cvc.match( /[0-9]{3}/g )) {
        return false;
      }

      return true;
    }

    if ( addingAccountType === 'BANK_ACCOUNT' ) {
      if ( form.nickname === '' || form.bankName === '' || form.name === '' || form.bsb === '' || form.accountNumber === '' || form.accountType === '' || form.accountType.value === '' || form.holderType === '' || form.holderType.value === '' ) {
        return false;
      }

      return true;
    }
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

    const { selectedPaymentType, selectedPaymentMethod, accounts } = this.state;

    return (
      <div>
        <h2>{this.renderBackButton()} Select account {this.renderAddButton( selectedPaymentType )}</h2>
        <p>Please select a account from below</p>
        <div className='payment-methods'>
          { accounts.filter( account => account.type == selectedPaymentType ).map( account => (
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
        <p>Click CONFIRM below to confirm that <b>{amount}</b> (including GST) {confirmDescription}</p>
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

  renderAddPaymentMethodButton() {
    const disabledClass = !this.canAddPaymentMethod() ? 'disabled' : '';
    return (
      <div className={`add-payment-method-btn ${disabledClass}`} onClick={this.submitAddPayment}>
        <span>ADD PAYMENT METHOD</span>
        <i className='material-icons'>chevron_right</i>
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

  renderAddButton( type ) {
    return (
      <div className='add-btn' onClick={this.onClickAddAccount( type )}>
        ADD
        <i className='material-icons'>add</i>
      </div>
    );
  }

  renderAddCard() {
    const { form, focusedField, error, submitting } = this.state;
    return (
      <div className='add-card'>
        <Cards
          number={form.number}
          name={form.name}
          expiry={form.expiry}
          cvc={form.cvc}
          focused={focusedField}
        />

        { error && (
          <div className='error-box'>
            {error}
          </div>
        )}

        <div className='input-field'>
          <label>Card Nickname</label>
          <input type='text' onChange={this.handleInputChange( 'nickname' )} />
        </div>

        <div className='input-field'>
          <label>Card Number</label>
          <MaskedInput mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/ ]} type='text' onChange={this.handleInputChange( 'number' )} onFocus={this.handleInputFocus( 'number' )} />
        </div>

        <div className='input-field'>
          <label>Full Name</label>
          <input type='text' onChange={this.handleInputChange( 'name' )} onFocus={this.handleInputFocus( 'name' )}/>
        </div>

        <div className='input-split'>
          <div className='input-field'>
            <label>Expiry</label>
            <MaskedInput mask={[/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/]} onChange={this.handleInputChange( 'expiry' )} onFocus={this.handleInputFocus( 'expiry' )} />
          </div>

          <div className='input-field'>
            <label>CVC</label>
            <MaskedInput mask={[/[0-9]/,/[0-9]/,/[0-9]/]} type='text' onChange={this.handleInputChange( 'cvc' )} onFocus={this.handleInputFocus( 'cvc' )} />
          </div>
        </div>
        <br /><br />
        {!submitting && this.renderAddPaymentMethodButton()}
        {submitting && <Spinner />}
      </div>
    );
  }

  renderAddBank() {
    const { error, submitting, form } = this.state;
    return (
      <div className='add-bank'>
        { error && (
          <div className='error-box'>
            {error}
          </div>
        )}

        <div className='input-field'>
          <label>Account Nickname</label>
          <input type='text' onChange={this.handleInputChange( 'nickname' )} value={form.nickname} />
        </div>

        <div className='input-field'>
          <label>Bank Name</label>
          <input type='text' onChange={this.handleInputChange( 'bankName' )} onFocus={this.handleInputFocus( 'bankName' )} value={form.bankName} />
        </div>

        <div className='input-field'>
          <label>Account Name</label>
          <input type='text' onChange={this.handleInputChange( 'name' )} onFocus={this.handleInputFocus( 'name' )} value={form.name} />
        </div>

        <div className='input-field'>
          <label>BSB</label>
          <MaskedInput mask={[/[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/]} onChange={this.handleInputChange( 'bsb' )} onFocus={this.handleInputFocus( 'bsb' )} value={form.bsb} />
        </div>

        <div className='input-field'>
          <label>Account Number</label>
          <input type='text' onChange={this.handleInputChange( 'accountNumber' )} onFocus={this.handleInputFocus( 'accountNumber' )} value={form.accountNumber} />
        </div>

        <div className='input-field'>
          <label>Account Type</label>
          <Dropdown options={[{ value: 'checking', label: 'Checking' }, { value: 'savings', label: 'Savings' }]} onChange={this.handleInputChange( 'accountType' )} value={form.accountType} />
        </div>

        <div className='input-field'>
          <label>Holder Type</label>
          <Dropdown options={[{ value: 'personal', label: 'Personal' }, { value: 'business', label: 'Business' }]} onChange={this.handleInputChange( 'holderType' )} value={form.holderType} />
        </div>
        <br /><br />
        {!submitting && this.renderAddPaymentMethodButton()}
        {submitting && <Spinner />}
      </div>
    );
  }

  render() {
    const { stage, addingAccount, addingAccountType } = this.state;

    if ( addingAccount ) {
      return (
        <div className='input-payment'>
          <h2>{this.renderBackButton()} Add account</h2>
          { addingAccountType === 'CARD' && this.renderAddCard() }
          { addingAccountType === 'BANK_ACCOUNT' && this.renderAddBank() }
        </div>
      )
    }


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
