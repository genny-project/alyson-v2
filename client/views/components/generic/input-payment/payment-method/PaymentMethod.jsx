import './paymentMethod.scss';
import React, { Component } from 'react';
import { object, bool, func } from 'prop-types';

class PaymentMethod extends Component {

    static propTypes = {
        account: object.isRequired,
        selected: bool.isRequired,
        onClick: func.isRequired,
        onDelete: func
    };

    handleOnClick = () => {
        this.props.onClick();
    }

    deletePaymentMethod = () => {

        const { account } = this.props;

        if(account.id) {

            if(account.type == 'bank_account') {
                if(confirm('Are you sure you would like to delete this bank account?')) {
                    this.props.onDelete && this.props.onDelete(account.id);
                }
            }
            else {
                if(confirm('Are you sure you would like to delete this credit card?')) {
                    this.props.onDelete && this.props.onDelete(account.id);
                }
            }
        }
    }

    render() {

        const { account, selected } = this.props;
        const selectedClass = selected ? 'selected' : '';

        return (
        <div className={`payment-method ${selectedClass}`} onClick={this.handleOnClick}>
            <div>
                {account.nickname}
                <br />
                {account.name}
                {account.type === 'BANK_ACCOUNT' && (
                    <div>
                        <small><b>BSB: </b>{account.bsb}<br /><b> Account Number: </b><span className='monospace'>{account.accountNumber}</span></small>
                    </div>
                )}
                {account.type === 'CARD' && (
                    <div>
                        <small className='monospace'>{account.number}</small>
                    </div>
                )}
            </div>
            {
                account.id && account.type != 'bank_account' ? <button onClick={this.deletePaymentMethod} className={'delete-button'}>Delete</button> : null
            }
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
