import './paymentType.scss';
import React, { Component } from 'react';
import { string, bool, func } from 'prop-types';


class PaymentType extends Component {
  static propTypes = {
    type: string.isRequired,
    icon: string.isRequired,
    selected: bool,
    onClick: func.isRequired,
  };

  static defaultProps = {
    selected: false,
  };

  render() {
    const { type, icon, selected, onClick } = this.props;
    const selectedClass = selected ? 'selected' : '';

    return (
      <div className={`payment-type ${selectedClass}`} onClick={() => onClick()}>
        <i className='material-icons'>{icon}</i>
        {type}
      </div>
    );
  }
}

export default PaymentType;
